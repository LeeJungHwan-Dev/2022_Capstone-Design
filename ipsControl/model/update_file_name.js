const firestore = require("firebase-admin/firestore");
const updateNoti = require("./noti_model");
const db = firestore.getFirestore();

async function update_file_name(id,file_name){
    const filename = file_name;
    const fileRef = db.collection('User_List').doc(id);

    const res = await fileRef.set({
        filename
        }, { merge: true });


    updateNoti.updateNoti(id,3);
    
    return true;
}

module.exports.name_update = update_file_name;