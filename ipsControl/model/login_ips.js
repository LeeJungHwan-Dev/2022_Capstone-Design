const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const crypto = require("crypto");
const serviceAccount = require("../cloud-server-da021-firebase-adminsdk-fvhfu-08ff7cba23.json");
let checkNum = 0;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://planar-beach-791.firebaseio.com",
  storageBucket: "cloud-server-da021.appspot.com"
});

const db = firestore.getFirestore();


async function checkDB(id,pw) {

  const password = crypto.createHash('sha512').update(pw).digest('base64');

  const userRef = db.collection('User_List').doc(id);
        
    const doc = await userRef.get();
        if (!doc.exists) {
          return 0;
        } else {
          let json = JSON.stringify(doc.data());
          let item = JSON.parse(json);
          if(item.pw === password){
            checkFirstDB(id);
            return 1;
          }else if(item.pw !== password){
            return 2;
          }
        }
}

async function authRequest(id){

  const userRef = db.collection('User_List').doc(id);

  const res = await userRef.set({
    authRequest: '1'
  }, { merge: true });

        
  const doc = await userRef.get('authID');
  let json = JSON.stringify(doc.data());
  let item = JSON.parse(json);

  const registrationToken = item.authID;
  const message = {
      data: {
          title: '우리집 지키미',
          body: '2차 인증을 진행해주세요.'
      },
      token: registrationToken
  };


  admin.messaging().send(message)
    .then((response) => {
    })
    .catch((error) => {

    });


}

async function observerAuth(id){
  const doc = db.collection('User_List').doc(id);

  const observer = await doc.onSnapshot(docSnapshot => {
    const check = docSnapshot.data().authRequest;
    if(check === 'ok'){
      checkNum = 1; 
    }
  }, err => {
      checkNum = 0;
  });
}

async function checkAuth(){
  return checkNum;
}

async function clearAuth(id){

  const userRef = db.collection('User_List').doc(id);

  const res = await userRef.set({
    authRequest: '0'
  }, { merge: true });
  checkNum = 0;
}

async function checkFirstDB(id){
  const dbRef = db.collection('User_List').doc(id);
        
  const doc = await dbRef.get();
        if (!doc.exists) {
          return 0;
        } else {
          let json = JSON.stringify(doc.data());
          let item = JSON.parse(json);
          if(item.first === undefined){
            resetDB(id);
            return 1;
          }
        }
}

async function resetDB(id){

  const userRef = db.collection('User_List').doc(id);
  const arr_1 = {};
  const file_log = {};
  const ip_rule_tables = {};
  const process_rule_tables = {};
  const change_tables = {};

  arr_1['0'] = 0;
  file_log['YYYY. MM. DD. hh:mm:ss'] = '예시 로그입니다.';
  ip_rule_tables['0'] = 'Any/Any/tcp/port/Allow 예시입니다. 사용시 지워주세요.';
  process_rule_tables['1'] = '1/icmp2/allow 예시입니다. 사용시 지워주세요.';
  change_tables['ip'] = '0';
  change_tables['process'] = '0';
  change_tables['update'] = '0';


  const res = await userRef.set({
    arr_1,
    file_log,
    ip_rule_tables,
    process_rule_tables,
    change_tables,
    first : false
  }, { merge: true });
}


module.exports.loginId = checkDB;
module.exports.authRequest = authRequest;
module.exports.observerAuth = observerAuth;
module.exports.checkAuth = checkAuth;
module.exports.clearAuth = clearAuth;
module.exports.resetDB = resetDB;