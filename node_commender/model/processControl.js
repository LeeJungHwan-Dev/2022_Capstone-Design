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
                shell.exec('echo 적용 완료!');
            }else if(item.process_status === "Allow"){
                shell.exec('echo 적용 완료!');
            }
        
        }
}


module.exports.process_start = start_process;
