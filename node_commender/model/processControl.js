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
            let json = JSON.stringify(doc.data().process_name);
            let item = JSON.parse(json);
            
            if(shell.exec('sudo chown no-internet:no-internet'+' downloads/'+item).code !== 0) {
                shell.echo('Error: command failed')
            }

            shell.exec('sudo chmod 770'+' downloads/'+item);
            shell.exec('cd ..');
        
        }
}


module.exports.process_start = start_process;
