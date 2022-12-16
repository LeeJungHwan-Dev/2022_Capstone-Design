import pyrebase

def checkApp():
    print("업데이트 삭제 모듈 작동")
    storage.delete("test.apk","")
    print("del_ok")

config ={
    "apiKey": "AIzaSyAd8nQ9-NpIkqCLqGJKIaMEjWXOzlwN1no",
    "authDomain": "cloud-server-da021.firebaseapp.com",
    "projectId": "cloud-server-da021",
    "storageBucket": "cloud-server-da021.appspot.com",
    "databaseURL":"https://cloud-server-da021.firebaseio.com",
    "messagingSenderId": "1040429568985",
    "appId": "1:1040429568985:web:e6d3fc1e8937c0db0fbfc8"
}


firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

path_on_cloud = "test.apk"
path_local = "code.png"

print('업데이트 파일 서버에서 삭제 완료')

checkApp()
