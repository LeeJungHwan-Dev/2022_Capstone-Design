const firestore = require("firebase-admin/firestore");
const db = firestore.getFirestore();
const admin = require('firebase-admin');
const name_update = require('./update_file_name');
const uuid = require('uuid-v4');

async function uploadFile(id,file_name) {

    
    const bucket   = admin.storage().bucket();
    const filename = "./upload/"+file_name;

    const metadata = {
      metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: uuid()
      },
      cacheControl: 'public, max-age=31536000',
    };
  
    // Uploads a local file to the bucket
    await bucket.upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: metadata,
    });

    await add_file(id,file_name);
    name_update.name_update(id,file_name);


    return true;

}


async function add_file(id,file_name){
  const fileRef = db.collection('User_List').doc(id);
  const date = new Date();
  const file_log = {};
  file_log[date.toLocaleDateString('ko-kr')+"  "+date.getHours()+' : '+date.getMinutes() +" : " + date.getSeconds()] = file_name;


  const res = await fileRef.set({
      file_log
      }, { merge: true });

  return true;
}

module.exports.upload = uploadFile;