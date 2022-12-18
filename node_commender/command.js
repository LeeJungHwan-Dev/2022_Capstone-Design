#!/usr/bin/env node
const getJson = require('./model/getIpRule');
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const serviceAccount = require('./serviceAccount.json');
const androidUpdate = require('./model/androidUpdate');
const checkVirus = require('./model/checkVirus');
const startProcess =require('./model/processControl');
let ip_status = '0';
let process_status = '0';
let update_status = '0';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://planar-beach-791.firebaseio.com",
  storageBucket: "cloud-server-da021.appspot.com"
});

const db = firestore.getFirestore();

chekc();




async function chekc(){

  const ipRef = db.collection('User_List').doc('admin');

  const observer = await ipRef.onSnapshot(async docSnapshot => {

    const update_doc = await ipRef.get();
    if (!update_doc.exists) {
        console.log('업데이트 변동 없음');
    } else { 
        let json = JSON.stringify(update_doc.data().change_tables);
        let item = JSON.parse(json);
        ip_status = item.ip;
        process_status = item.process;
        update_process = item.update;

        if(item.ip === '1'){
          await getJson.getIp();
          ip_status = '0';
        }else if(item.update === '1'){
          await androidUpdate.androidUpdate();
         // await checkVirus.checkVirus();
          update_status = '0';
          console.log('다운로드 완료');
        }else if(item.process === '1'){
          await startProcess.process_start();
          process_status = '0';
        }

    }

    // 프로세스 업데이트 기능도 추가해야함

    const change_tables = {};
    const updateRef = db.collection('User_List').doc('admin');


      change_tables['ip'] = ip_status;
      change_tables['process'] = process_status;
      change_tables['update'] = update_status;
    

    const res = await updateRef.set({
        change_tables
        }, { merge: true });

      
    }, err => {
      console.log(`Encountered error: ${err}`);
    });


}