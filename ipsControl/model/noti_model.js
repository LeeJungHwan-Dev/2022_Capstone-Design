const firestore = require("firebase-admin/firestore");
const db = firestore.getFirestore();


async function update_process(id,title){

  const change_tables = {};
  const updateRef = db.collection('User_List').doc(id);


  if(title === 1){
    change_tables['ip'] = '1';
  }else if(title === 2){
    change_tables['process'] = '1';
  }else if (title === 3){
    change_tables['update'] = '1';
  }

  const res = await updateRef.set({
      change_tables
      }, { merge: true });

  return true;
}

module.exports.updateNoti = update_process;
