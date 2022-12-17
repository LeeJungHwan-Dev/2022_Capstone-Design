const { FieldValue } = require("@google-cloud/firestore");
const firestore = require("firebase-admin/firestore");
const updateNoti = require("./noti_model");
const db = firestore.getFirestore();



async function add_IP_rule(id,rule_json){
    const ip_rule_tables = {};
    const ipRef = db.collection('User_List').doc(id);
    let ip = rule_json.start_ip +"/" +rule_json.end_ip +"/"+rule_json.port_number+"/"+rule_json.ip_protocal+"/"+rule_json.ip_policy;

    ip_rule_tables[rule_json.policy_number] = ip;
    updateNoti.updateNoti(id,1);

    const res = await ipRef.set({
        ip_rule_tables
        }, { merge: true });

    return true;
}

async function get_ip_rules(id){
    const ipRef = db.collection('User_List').doc(id);
    const doc = await ipRef.get();
    if (!doc.exists) {
      return 0;
    } else {
      return doc.data();
    }
  }

async function del_ip_rules(id,rule_number){
    const User_rules = db.collection('User_List').doc(id);
    const ip_rule_tables={};

    ip_rule_tables[rule_number] = FieldValue.delete();
    
    const res = await User_rules.set({
        ip_rule_tables
      }, { merge: true });
    
    return true;

}

async function add_process_rule(id,rule_json){
  const process_rule_tables = {};
  const processRef = db.collection('User_List').doc(id);
  let process = rule_json.policy_num +"/" +rule_json.process_name +"/"+ rule_json.process_policy;

  process_rule_tables[rule_json.policy_num] = process;
  updateNoti.updateNoti(id,2);
  const res = await processRef.set({
      process_rule_tables
      }, { merge: true });

  return true;
}

async function get_process_rules(id){
  const processRef = db.collection('User_List').doc(id);
  const doc = await processRef.get();
  if (!doc.exists) {
    return 0;
  } else {
    return doc.data();
  }
}

async function del_process_rules(id,rule_number){
  const User_rules = db.collection('User_List').doc(id);
  const process_rule_tables={};

  
  process_rule_tables[rule_number] = FieldValue.delete();
  
  const res = await User_rules.set({
      process_rule_tables
    }, { merge: true });
  
  return true;

}

module.exports.edit_rule = add_IP_rule;
module.exports.get_ip_rules = get_ip_rules;
module.exports.del_ip_rules = del_ip_rules;
module.exports.edit_process_rule = add_process_rule;
module.exports.get_process_rules = get_process_rules;
module.exports.del_process_rules = del_process_rules;