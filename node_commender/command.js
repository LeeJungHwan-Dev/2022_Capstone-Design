#!/usr/bin/env node
const getJson = require('./model/getIpRule');
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const serviceAccount = require('./serviceAccount.json');
const androidUpdate = require('./model/androidUpdate');
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
          ip_status = '0';
          update();
          await getJson.getIp();
        }else if(item.update === '1'){
          update_status = '0';
          update();
          await androidUpdate.androidUpdate();
        }else if(item.process === '1'){
          process_status = '0';
          update();
          await startProcess.process_start();
        }

    }
  })
}


async function update(){
  const change_tables = {};
    const updateRef = db.collection('User_List').doc('admin');


      change_tables['ip'] = ip_status;
      change_tables['process'] = process_status;
      change_tables['update'] = update_status;
    

    const res = await updateRef.set({
        change_tables
        }, { merge: true });
}