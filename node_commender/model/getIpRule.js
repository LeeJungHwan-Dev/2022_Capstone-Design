#!/usr/bin/env node
const { Console } = require("console");
const firestore = require("firebase-admin/firestore");
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const log = require('./getLog');


async function getIp (){

    const db = firestore.getFirestore();

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
                        let status = '';
                        //0 시작 아이피 / 1 도착 아이피 / 2 포트 / 3 프로토콜 / 4 정책/
                        console.log('ufw '+ip[4]+' from '+ip[0] + ' to any port ' + ip[2] + ' proto '+ip[3]);
            
                        if(shell.exec('sudo ufw '+ip[4]+' from '+ip[0] + ' to any port ' + ip[2] + ' proto '+ip[3]).code !== 0) {
                            shell.echo('Error: command failed')
                        }
                        //sudo ebtables -A OUTPUT -p IPv4 --ip-src 172.168.0.2 -j DROP
                        if(ip[4] == 'deny'){
                            status = 'DROP';
                        }else{
                            status = 'ACCEPT'
                        }
                        shell.exec('sudo ebtables -A OUTPUT -p IPv4 --ip-src '+ip[0]+' -j '+status);
                        shell.exec('sudo ebtables -A FORWARD -p arp --arp-ip-dst '+ip[0]+' -j '+status);
            }

            console.log('IP Rule 적용 완료.');

        }
}


module.exports.getIp = getIp;
