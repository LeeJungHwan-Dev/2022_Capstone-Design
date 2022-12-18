#!/usr/bin/env node
const firestore = require("firebase-admin/firestore");
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const log = require('./getLog');


async function getIp (){

    const db = firestore.getFirestore();


    /*const fileRef = db.collection('User_List').doc('admin');
        
    const file_doc = await fileRef.get();
    if (!file_doc.exists) {
        console.log('파일 변동 없음');
    } else { 
        const result = spawn('python',['app_downloads/getFile.py',file_doc.data().filename],);

        result.stdout.on('data',(result1)=>{
        console.log('서버 호출 완료.');
        console.log(result1.toString())
        })
    }*/

    await log.getLog();
    //로그 서버로 전송

    const ipRef = db.collection('User_List').doc('admin');
        
        const doc = await ipRef.get();
        if (!doc.exists) {
        console.log('No such document!');
        } else {
            let json = JSON.stringify(doc.data().ip_rule_tables);
            let item = JSON.parse(json);

            shell.exec('sudo ebtables -F');
            
            // ip룰 작성
            for(ruleNumber in item){
                        let ipList = item[ruleNumber];
                        let ip = ipList.split('/');
                        //0 시작 아이피 / 1 도착 아이피 / 2 포트 / 3 프로토콜 / 4 정책/
                        console.log('ufw '+ip[4]+' from '+ip[0] + ' to any port ' + ip[2] + ' proto '+ip[3]);
            
                        if(shell.exec('sudo ufw '+ip[4]+' from '+ip[0] + ' to any port ' + ip[2] + ' proto '+ip[3]).code !== 0) {
                            shell.echo('Error: command failed')
                        }

                        shell.exec('sudo ebtables -A FORWARD -p arp --arp-ip-dst '+ip[0]+' -j DROP');
            }

        }
}


module.exports.getIp = getIp;
