const shell = require('shelljs');
const spawn = require('child_process').spawn;

function updateAndroid(){
    shell.exec('adb install -r /Users/lee/Desktop/node_commender/update.apk');
    console.log('ok');

    const result = spawn('python',['app_downloads/delFile.py'],);

    result.stdout.on('data',(result1)=>{
	console.log('업데이트 서버 앱 업데이트 삭제 완료.');
	console.log(result1.toString())
    })
}


module.exports.androidUpdate = updateAndroid;