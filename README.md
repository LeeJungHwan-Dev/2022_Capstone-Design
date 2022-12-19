# ⭐️ 2022_Capstone-Design
* Start : 2022 / 09 ~ End : 2022 / 12
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
* 해당 과정을 통해 아파트 월패드의 주된 감염 경로는 웹 쉘, 관리자 PC 해킹 등이 있음을 인지했습니다.

2. 이론 설계
* 해커가 "월패드 제어부"를 목표로 삼는 것은 인지했습니다. 이와 같은 문제를 해결하는 
  방법을 생각해 본 결과 관리자의 PC를 월패드와 분리시키고 로그인 부분에 외부적인 요소를 더하면 해커의 공격을 보다 효과적으로 차단할 수 있겠다 생각했습니다.

~~~~

3. 이론 시각화
![이미지 시각화](https://user-images.githubusercontent.com/93726941/208429222-5dc99e7f-7e0d-4b56-bbdc-b616cf880226.png)

~~~~
4. 기능 
~~~~
