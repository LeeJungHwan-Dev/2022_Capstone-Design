const firestore = require("firebase-admin/firestore");
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const fs = require('fs');
const checkVirus = require('../model/checkVirus');

async function updateAndroid(){
    const db = firestore.getFirestore();


    const fileRef = db.collection('User_List').doc('admin');
    const file_doc = await fileRef.get();
    if (!file_doc.exists) {
        console.log('파일 변동 없음');
    } else {
        let json = JSON.stringify(file_doc.data().filename);
        let item = JSON.parse(json);

        console.log('다운로드 모듈 시작 : ' + item);

        const result1 = spawn('python',['app_downloads/getFile.py','server'],);
        //const result2 = spawn('python',['app_downloads/delFile.py',item],);



        result1.stdout.on('data',(result1)=>{
            console.log('다운로드 완료.');
            })


            await checkVirus.checkVirus();

            console.log('앱 업데이트 검사');
            shell.exec('adb connect 172.30.1.1:5555');
            console.log('앱 설치 시작');
            shell.exec('sudo adb install -r /home/raspi/2022_Capstone-Design/node_commender/downloads/' + item);
            


    }

}


module.exports.androidUpdate = updateAndroid;