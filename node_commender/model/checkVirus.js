const shell = require('shelljs');

function checkVirus(){
    console.log("Virus Check start");
    shell.exec('sudo clamscan -r ./downloads --move=/virus');
    console.log('Virus Ok');
}


module.exports.checkVirus = checkVirus;