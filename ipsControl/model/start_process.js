const firestore = require("firebase-admin/firestore");
const db = firestore.getFirestore();
const updateNoti = require("./noti_model");


async function update_process(id,name){

  const process_name = name;
  const updateRef = db.collection('User_List').doc(id);

  const res = await updateRef.set({
      process_name
      }, { merge: true });

  updateNoti.updateNoti(id,2);

  return true;
}

module.exports.startProcess = update_process;
