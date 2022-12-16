
const firestore = require("firebase-admin/firestore");
const db = firestore.getFirestore();


// 공지사항 작성 함수
async function edit_contents(id,body_json){

  const infoRef = db.collection('User_List').doc(id);
  const arr_name = body_json.number;

  if(arr_name === "1"){
    const res = await infoRef.set({
    arr_1:{
      title: body_json.title,
      contents: body_json.contents,
    },
    }, { merge: true });
  }else if(arr_name === "2"){
    const res = await infoRef.set({
      arr_1:{
        title2: body_json.title,
        contents2: body_json.contents,
      },
      }, { merge: true });
  }else{
    const res = await infoRef.set({
      arr_1:{
        title3: body_json.title,
        contents3: body_json.contents,
      },
      }, { merge: true });
  }

  return true;
}

// 공지사항 get 함수
async function get_contents(id){
  const infoRef = db.collection('User_List').doc(id);
  const doc = await infoRef.get();
  if (!doc.exists) {
    return 0;
  } else {
    return doc.data();
  }
}


module.exports.edit = edit_contents;
module.exports.get_edit = get_contents;