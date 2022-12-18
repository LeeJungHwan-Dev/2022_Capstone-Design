import pyrebase
import sys

def checkApp(filename):
    print("업데이트 삭제 모듈 작동")
    storage.delete(filename,"")

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

checkApp(sys.argv[1])
