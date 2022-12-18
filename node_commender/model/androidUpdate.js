const firestore = require("firebase-admin/firestore");
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const fs = require('fs');

async function updateAndroid(){
    const db = firestore.getFirestore();


    const fileRef = db.collection('User_List').doc('admin');
    const file_doc = await fileRef.get();
    if (!file_doc.exists) {
        console.log('파일 변동 없음');
    } else {
        let json = JSON.stringify(file_doc.data().filename);
        let item = JSON.parse(json);

        console.log('다운로드 모듈 시작');

        const result1 = spawn('python',['app_downloads/getFile.py',file_doc.data().filename],);
        //const result2 = spawn('python',['app_downloads/delFile.py',item],);


        result1.stdout.on('data',(result1)=>{
            console.log('다운로드 완료.');
            })

            //console.log('앱 업데이트 검사');
            //shell.exec('adb connect 172.30.1.87:5555');
            console.log('앱 설치 시작');
            shell.exec('sudo adb install -r ./downloads/' + item);


        /*result2.stdout.on('data',(result1)=>{
            try {

                //동기 방식으로 파일 삭제
                //fs.unlinkSync("../node_commender/downloads/"+item)
            
            } catch (err) {
            
                if(err.code == 'ENOENT'){
                    console.log("파일 삭제 Error 발생");
                }
            }

            //console.log('업데이트 파일 삭제 완료.');

        })*/


    }

}


module.exports.androidUpdate = updateAndroid;