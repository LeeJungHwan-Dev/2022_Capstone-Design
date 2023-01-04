# ⭐️ 2022_Capstone-Design
* Start : 2022 / 09 ~ End : 2022 / 12 / 21
* OS : MacOS Ventura 13.1 / Raspberry Pi OS 32bit
* Node.Js ver : v18.11.0
* Python ver : 3.8.10
* DB : Firebase DB

## ⚙️ 각 분야 개발 스택
* Web : Express / BootStrap
* Android : Android Studio Dolphin | 2021.3.1 Patch 1 + Java
* IPS : Node.Js / Python

## 🥅 목표

> 🗄️ 파일 제어 기능
>> * 파일 시스템에 생성/변경 시 해당 파일이 악성(Black)인지 검사하는 기능이 필요하다.
>> * WhiteList에 존재하는 파일의 생성/변경/삭제/이름변경/실행에 대해서는 허용할 수 있어야한다.
>
> 🌐 네트워크 제어 기능
>> * Black List에 존재하는 IP,PORT(TCP/UDP)에 대해서 네트워크 접근을 차단할 수 있어야한다.
>> * Black List에 존재하는 프로세스의 네트워크 접근을 차단할 수 있어야한다.
>> * White List에 존재하는 IP,PORT(TCP/UDP)에 대한 네트워크 접근을 허용할 수 있어야한다.
>
> 🎛️ 단말에 포함된 매체에 대한 제어 기능
>> * Camera, 마이크 및 RS-485 홈네트워크 기기에 대한 제어기능이 필요하다.
>> * Black List에 존재하는 실행파일(프로세스)는 기기를 사용할 수 없어야 한다.
>> * White List에 존재하는 실행파일(프로세스)는 기기를 사용할 수 있어야 한다.
>> * 기기의 종류 ( Camera, 마이크, USB Port, Serial Port(RS-232c, RS-485, U-ART)

## 🔎 과제 해결 과정
~~~~
1. 월패드 특성 파악 및 사례 조사
*  해당 과정을 통해 아파트 월패드의 주된 감염 경로는 웹 쉘, 관리자 PC 해킹 등이 있음을 인지했습니다.

2. 이론 설계
*  해커가 "월패드 제어부"를 목표로 삼는 것은 인지했습니다. 이와 같은 문제를 해결하는 
   방법을 생각해 본 결과 관리자의 PC를 월패드와 분리시키고 로그인 부분에 외부적인 요소를 더하면 해커의 공격을 보다 효과적으로 차단할 수 있겠다 생각했습니다.
   즉, 아파트 서버가 아닌 관리자 PC와 월패드 사이에 보안 서버를 위치 시켜 해커가 관리자의 PC를 해킹하면 직접적으로 월패드에 접근할 수 없게 구성했습니다.

~~~~

3. 이론 시각화
![이미지 시각화](https://user-images.githubusercontent.com/93726941/208429222-5dc99e7f-7e0d-4b56-bbdc-b616cf880226.png)

~~~~
4. 기능 구현
*  시각화한 이론을 바탕으로 Web : Firebase DB , Express , NodeJS | Android : Java , Firebase DB , FCM | 라즈베리 보안 모듈 : Node.JS , Python etc... 
~~~~

## ✅ 둘러보기 및 상세 설명


|로그인|
|:---:|
|<img src="https://user-images.githubusercontent.com/93726941/208432254-ef4e2671-882b-4654-8218-366c0df7dbfa.gif" width="700" height = "400"/>|
|IP 추가|
|<img src="https://user-images.githubusercontent.com/93726941/208433870-1ce44b84-43d5-49cf-9a19-dc5205a1212a.gif" width="700" height = "400"/>|
|프로세스 제어|
|<img src="https://user-images.githubusercontent.com/93726941/208434742-9bb504ad-8d2d-492f-bf08-f937459d801d.gif" width="700" height = "400"/>|
|업데이트 제어|
|<img src="https://user-images.githubusercontent.com/93726941/208435384-b76e0056-be00-4402-b8dc-f84e032ce3e0.gif" width="800" height = "600"/>|
|통합 로그|
|<img src="https://user-images.githubusercontent.com/93726941/208435920-32ed2af6-f50e-4989-87de-8d930d2738aa.gif" width="800" height = "600"/>|
|게시글 작성|
|<img src="https://user-images.githubusercontent.com/93726941/208436529-61d77748-c70e-44f1-b4a4-f09e31cbab7a.gif" width="800" height = "600"/>|

## 💡 사용법

⚠️ 모든 프로젝트 파일은 올바른 node 버전과 python 버전을 확인 및 설치 후 npm install을 진행 후 사용해주세요. </br>
⚠️ 해당 프로젝트를 테스트하기 위해선 아래와 같은 DB 구조를 가져야합니다. 꼭 참고해주세요.</br>
⚠️ 제작된 라즈베리파이 모듈이 아닌 다른 PC에서 작업하면 파일 경로에 따른 오류가 발생할 수 있습니다. </br>
⚠️ 회원제 서비스를 구성하였기 때문에 최초 아이디와 비밀번호는 업체에서 직접 DB에 등록하여 사용자에게 제공해야합니다. </br>
⚠️ 비밀번호는 반드시 SHA-512 방식으로 암호화후 base64로 변환하여 디비에 등록하고 사용해야합니다. </br>

~~~
> ipsControl 
>> * 해당 폴더는 웹 사이트의 프론트와 백을 함께 포함한 폴더입니다. 서버에 업로드하여 사용해 주세요.
>> * 반드시 최상위 경로에 firebase-admin.json 파일을 발급받아 내장 후 사용해 주세요.

> ips_2auth
>> * 해당 폴더는 Android 기반 2차 인증 앱입니다. 이 또한 빌드전 파이어 베이스를 안드로이드 스튜디오에서 연동후 사용해 주세요.
>> * FCM 서비스도 함께 사용해주세요.

> node_commender
>> * node.Js 기반의 보안 모듈에 탑재되는 프로그램입니다.
>> * 반드시, 최상위 폴더에 Firebase의 service_account.json을 발급받아 최상위 경로에 내장 후 사용해주세요.
>> * node_commender/app_downloads/* 경로에 파이어 베이스 어드민.json을 받아 내장후 사용해주세요.

~~~

## 📑 DB 구조

* 최초 로그인시에 pw를 제외한 다른 필드값은 자동 생성됩니다.

![ips](https://user-images.githubusercontent.com/93726941/208594099-0215133b-1862-4ef1-949e-ac5fcefcc44d.jpeg)


## 🤔 기능 추가 설명
~~~
> IP 제어
>> IP 제어는 첫 번째로 관리 웹 사이트에서 정보를 넘겨주면 DB에 업로드합니다.
>> 업로드된 IP 규칙을 보안 모듈이 DB에서 읽어와 각 iptables , ebtables에 ARP Rule과 ip Rule을 적용하여 인터넷을 제어합니다.
>> 위와 같은 과정을 통해 기본적으로 BlackList IP에 대해서 ARP 네트워크 은닉이 가능해집니다.

> process 제어
>> process 제어는 관리 웹사이트에서 정보를 넘겨주면 DB에 파일 이름과 정책(Allow, Deny) 등의 정보를 업로드합니다.
>> 해당 정보를 보안 모듈이 DB에서 받아와 "shelljs" 라이브러리를 사용해 쉘 스크립트를 실행해 프로세스를 제어합니다.
>> 또한 허용하지 않은 프로세스에 대해서는 "no-internet" 그룹이 만들어져있어 process의 인터넷을 차단합니다.
>> 마지막으로 파일의 권한 또한 변경되어 허용되지 않은 프로세스는 오직 "no-internet" 그룹에서만 실행할 수 있습니다.

> 업데이트 제어
>> 업데이트 제어는 관리 웹사이트에서 파일을 넘겨주면 multer 즉 파이어 스토리지에 업로드합니다.
>> 파일이 업로드가 완료되면 보안 모듈에서는 파일의 변경 내용을 DB에서 받아와 바이러스를 1차적으로 진행하고 apk면 apk 설치를 진행합니다.
>> 아닐 경우 바이러스 검사후 폴더에 파일을 위치시킵니다.

> 통합 로그
>> 통합 로그는 보안 모듈에서 ufw 방화벽 log를 DB에 업데이트하여 관리자가 즉각 확인할 수 있게 제공하는 편의 기능입니다.
>> Firebase를 사용했습니다.

> 게시글 작성
>> 해당 기능은 간단한 Form과 node.js 및 Firebase에 정보를 등록하는 방법을 기반으로 제작된 기능입니다.
~~~
