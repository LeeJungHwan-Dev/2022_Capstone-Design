const shell = require('shelljs');

function checkVirus(){
    shell.exec('clamscan -r /NODE_COMMENDER --move=/virus');
    console.log('Virus Ok');
}


module.exports.checkVirus = checkVirus;