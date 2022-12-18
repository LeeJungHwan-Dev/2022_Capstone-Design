const express = require("express");
const app = express();
const session = require('express-session');
const login = require("./model/login_ips");
const cookieParser = require('cookie-parser');
const edit_contests = require('./model/edit_contents');
const edit_rules = require('./model/edit_rule');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const update = require('./model/update_file');
const fs = require('fs');
const startProcess = require('./model/start_process');
let file_name; // 파일 이름 저장 변수 -> 파이어 스토리지 변수용

// 파이어 스토리지 파일 업로드 함수
const upload = multer({
      // 파일 저장 위치 (disk , memory 선택)
      storage: multer.diskStorage({
          destination: function (req, file, done) {
              done(null, 'upload/');
          },
          filename: function (req, file, done) {
              file_name = file.originalname;
              const ext = path.extname(file.originalname);
              done(null, path.basename(file.originalname, ext) + ext);
          }
      }),
      // 파일 허용 사이즈 (500 MB)
      limits: { fileSize: 500 * 1024 * 1024 }
      
});


app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/upload', express.static(__dirname + "upload"));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secure: true,	// https 환경에서만 session 정보를 주고받도록처리
  secret: 'iaoshd@#IHOI@#$OI@H@#', // 암호화하는 데 쓰일 키
  resave: false, // 세션을 언제나 저장할지 설정함
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    Secure: true,
    maxAge: 86400000
  },
  name: 'session-cookie'
}));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/res", express.static(__dirname + "/res"));
app.use("/css", express.static(__dirname + "/css"));
app.engine("html", require("ejs").renderFile);

//서버 시작 log
var server = app.listen(3000, function () {
  console.log("Express server has started on port 3000");
});

// 메인 페이지에 들어올경우 세션 파기
app.get("/", (req, res) => {
  req.session.destroy();
  res.render(__dirname + "/views/login.html");
});

//로그인 아이디 및 패스워드 확인
app.post("/", async (req, res) => {
  
  const {id,pw} = req.body;

  if(id === '' || pw === ''){
    res.send("<script>alert('ID/PW를 입력해주세요.'); document.location.href='/'</script>"); 
  }else{
    let status = await login.loginId(id,pw);

    if (status === 0) {
      res.send("<script>alert('존재하지 않는 아이디입니다.'); document.location.href='/'</script>");
    } else if(status === 1){
      req.session.ids = id;
      res.send("<script>document.location.href='/login_2nd'</script>");
    }else if(status === 2){
      res.send("<script>alert('비밀번호를 확인해주세요.'); document.location.href='/'</script>");
    }
  }
});

//로그인 페이지 2차 인증 요청
app.get("/login_2nd", async (req, res) => {

  if(req.session.ids === undefined){
    res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
  }else{
    login.authRequest(req.session.ids); // 사용자의 아이디로 auth 요청
    login.observerAuth(req.session.ids); // 옵저버를 사용하여 사용자 핸드폰에 전송된 Auth 승인 여부 관찰
    res.render(__dirname + "/views/login_2nd.html");
  }
});

// 로그인 페이지 확인 요청 처리
app.post("/login_2nd", async (req, res) => {
  const {auth} = req.body;

  if(req.session.ids === undefined){
    res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
  }else{
    if(1 === await login.checkAuth()){ // 아이디가 존재하여 서버에 Auth가 인증이 완료되었는지 확인
      await login.clearAuth(req.session.ids); // 인증이 끝난 경우 Auth 초기화
      req.session.auth = 'ok'; // 세션에 기록
      res.send("<script>alert('관리자님 환영합니다.'); document.location.href='/main'</script>");
    }else{
      res.send("<script>alert('인증이 올바르지 않습니다. 새로운 인증을 전송했습니다.'); document.location.href='/login_2nd' </script>");
    }
    
  }
});

//메인 페이지 json 및 공지사항 처리
app.get("/main",async (req, res) => {

  if(req.session.ids === undefined || req.session.auth !== 'ok'){
    res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
  }else{

    const contents = await edit_contests.get_edit(req.session.ids);
    let json = JSON.stringify(contents);
    let item = JSON.parse(json);
    const datas = await edit_rules.get_ip_rules(req.session.ids);
    let json2 = JSON.stringify(datas);
    let item2 = JSON.parse(json2);


    res.render(__dirname + "/views/main",{
        title : item.arr_1.title,
        contents : item.arr_1.contents,
        title2 : item.arr_1.title2,
        contents2 : item.arr_1.contents2,
        title3 : item.arr_1.title3,
        contents3 : item.arr_1.contents3,
        data : item2.ip_rule_tables // ip룰이 담긴 Json
    });
  }


});

//메인 홈페이지 게시글 작성에 대한 게시글 서버에 등록
app.post("/main",async (req,res)=>{

  if(await edit_contests.edit(req.session.ids,req.body)){
    res.send("<script>alert('게시글 등록 완료.'); document.location.href='/main'</script>")
  }

});

//서버에 ip룰 추가
app.post("/main/add_ip_rule",async (req,res)=>{

  if(await edit_rules.edit_rule(req.session.ids,req.body)){
    res.send("<script>alert('IP 룰 등록 완료.'); document.location.href='/main' </script>");
  }
  

});

//서버에서 ip 룰 삭제
app.post("/main/ip_delete",async (req,res)=>{

  if(await edit_rules.del_ip_rules(req.session.ids,req.body.del_rule_num)){
    res.send("<script>alert('IP 룰 삭제 완료.'); document.location.href='/main' </script>");
  }

});


// 업데이트 제어 버튼 클릭시 맨 처음 보여지는 화면 랜더
app.get("/main/update_file_main",async (req,res)=>{
    //세션 체크
    if(req.session.ids === undefined || req.session.auth !== 'ok'){
      res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
    }else{

      const contents = await edit_contests.get_edit(req.session.ids);
      let json = JSON.stringify(contents);
      let item = JSON.parse(json);
      const datas = await edit_rules.get_ip_rules(req.session.ids);
      let json2 = JSON.stringify(datas);
      let item2 = JSON.parse(json2);

      //공지사항 1 2 3 json 전송 및 랜더링
      res.render(__dirname + "/views/update_file_main",{
        title : item.arr_1.title,
        contents : item.arr_1.contents,
        title2 : item.arr_1.title2,
        contents2 : item.arr_1.contents2,
        title3 : item.arr_1.title3,
        contents3 : item.arr_1.contents3,
        data : item2.file_log
    });


    }
})

// 업데이트 제어 제출 버튼 클릭시 파일 업로드
app.post("/main/update_file_main",upload.single('uploadfile'),async (req,res)=>{
      if(await update.upload(req.session.ids,file_name)){
        fs.unlink(__dirname+'/upload/'+file_name,err =>{
          if(err) throw err;
        });
        res.send("<script>alert('파일 업로드 완료!!'); document.location.href='/main/update_file_main'</script>")
      }
})

app.get("/main/process_main",async (req,res)=>{
  if(req.session.ids === undefined || req.session.auth !== 'ok'){
    res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
  }else{

      const contents = await edit_contests.get_edit(req.session.ids);
      let json = JSON.stringify(contents);
      let item = JSON.parse(json);
      const datas = await edit_rules.get_ip_rules(req.session.ids);
      let json2 = JSON.stringify(datas);
      let item2 = JSON.parse(json2);

      //공지사항 1 2 3 json 전송 및 랜더링
      res.render(__dirname + "/views/process_main",{
        title : item.arr_1.title,
        contents : item.arr_1.contents,
        title2 : item.arr_1.title2,
        contents2 : item.arr_1.contents2,
        title3 : item.arr_1.title3,
        contents3 : item.arr_1.contents3,
        data : item2.process_rule_tables
    });
  }

});

app.post("/main/add_process_main",async(req,res)=>{
  if(await edit_rules.edit_process_rule(req.session.ids,req.body)){
    res.send("<script>alert('프로세스 룰 등록 완료.'); document.location.href='/main/process_main' </script>");
  }
});

//서버에서 프로세스 룰 삭제
app.post("/main/del_process_main",async (req,res)=>{

  if(await edit_rules.del_process_rules(req.session.ids,req.body.policy_num)){
    res.send("<script>alert('프로세스 룰 삭제 완료.'); document.location.href='/main/process_main' </script>");
  }

});



app.get("/main/total_log",async (req,res)=>{
  if(req.session.ids === undefined || req.session.auth !== 'ok'){
    res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
  }else{

      const contents = await edit_contests.get_edit(req.session.ids);
      let json = JSON.stringify(contents);
      let item = JSON.parse(json);
      const datas = await edit_rules.get_ip_rules(req.session.ids);
      let json2 = JSON.stringify(datas);
      let item2 = JSON.parse(json2);

      //공지사항 1 2 3 json 전송 및 랜더링
      res.render(__dirname + "/views/total_log",{
        title : item.arr_1.title,
        contents : item.arr_1.contents,
        title2 : item.arr_1.title2,
        contents2 : item.arr_1.contents2,
        title3 : item.arr_1.title3,
        contents3 : item.arr_1.contents3,
        data : item2.total_log
    });
  }
});

app.post("/main/update_process",async (req,res)=>{
  if(req.session.ids === undefined || req.session.auth !== 'ok'){
    res.send("<script>alert('올바르지 않은 접근입니다.'); document.location.href='/'</script>");
  }else{
      startProcess.startProcess(req.session.ids,req.body.process_name,req.body.process_status);
      res.send("<script>alert('프로세스 실행명령 전달 완료.  \\n주의! 파일이 존재하지 않을 경우 실행되지 않습니다.'); document.location.href='/main/process_main'</script>" );
  }
})



//IVHbV36O5znc/5Bsmo8vvKvn9RKSfxGJLz+JiyKHFsN72BbayDOiuEwWadhXRJki0J8Pvc8v5y5Lth6l3G36kg==