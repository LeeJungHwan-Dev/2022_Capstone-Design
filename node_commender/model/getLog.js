const firestore = require("firebase-admin/firestore");

async function add_log(data){

    const db = firestore.getFirestore(data);


    const total_log = {};
    const logRef = db.collection('User_List').doc('admin');


  for(let i = 0; i < data.length; i+=1){
    total_log[i] = data[i];
   }

    const res = await logRef.set({
        total_log
        }, { merge: true });

    return true;
}


const getLog = function () {
    const fs = require('fs');
  
    fs.readFile('/var/log/ufw.log', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      }
      return add_log(data.toString().split('\n'));
    });
  };

module.exports.getLog = getLog;