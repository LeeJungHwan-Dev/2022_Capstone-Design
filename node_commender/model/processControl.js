#!/usr/bin/env node
const firestore = require("firebase-admin/firestore");
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const log = require('./getLog');


async function start_process (){

    const db = firestore.getFirestore();

    const ipRef = db.collection('User_List').doc('admin');
        
        const doc = await ipRef.get();
        if (!doc.exists) {
        console.log('No such document!');
        } else {
            let json = JSON.stringify(doc.data());
            let item = JSON.parse(json);
            
            if(item.process_status === 'Deny'){
                if(shell.exec('sudo chown no-internet:no-internet'+' downloads/'+item.process_name).code !== 0) {
                    shell.echo('Error: command failed')
                }
                shell.exec('sudo chmod 770'+' downloads/'+item.process_name);
                shell.exec('echo No InterNet 적용 & 실행 완료.');
                shell.exec("sudo -u no-internet " + '"./downloads/server"'+" &");
            }else if(item.process_status === "Allow"){
                shell.exec('sudo chmod 777'+' downloads/'+item.process_name);
                shell.exec('sudo chown raspi:raspi downloads/'+item.process_name);
                shell.exec('echo Allow 적용 완료!');
                shell.exec('sudo ./downloads/'+item.process_name+' &');
            }
        
        }
}


module.exports.process_start = start_process;
