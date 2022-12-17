#!/usr/bin/env node
const getJson = require('./model/getIpRule');
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const serviceAccount = require('./serviceAccount.json');
const androidUpdate = require('./model/androidUpdate');
const checkVirus = require('./model/checkVirus');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://planar-beach-791.firebaseio.com",
  storageBucket: "cloud-server-da021.appspot.com"
});

chekc();

async function chekc(){

  const db = firestore.getFirestore();

  const ipRef = db.collection('User_List').doc('admin');

  const observer = await ipRef.onSnapshot(async docSnapshot => {
    await getJson.getIp();
    await checkVirus.checkVirus();
    await androidUpdate.androidUpdate();
    
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
}
