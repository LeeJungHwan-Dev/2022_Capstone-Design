const shell = require('shelljs');

function checkVirus(){
    shell.exec('clamscan -r ./node_commender/downloads --move=/virus');
    console.log('Virus Ok');
}


module.exports.checkVirus = checkVirus;