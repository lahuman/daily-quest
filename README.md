# [Daily Quests](https://217.142.255.104.nip.io/) 

> 일일 퀘스트를 실행하여, 훌륭한 내가 되기를 바랍니다.

[Daily Quests 바로 가기](https://217.142.255.104.nip.io/)

## 업데이트 이력



### *2024-04-08*
- 반복 기능 고도화
  + 평일 / 휴일 추가


### *2024-03-04*
- web push 기능 추가
  + 관리 요청 / 수락 / 반려 시 알림 발송
  + todo 등록 / 완료 / 취소 시 알림 발송
- 계정 간 관리자 명칭 기능 제공
- 운영 서버 변경
- 디자인 고도화

### *2023-12-31*
- 계정간 담당자 지정 기능 추가
- 담당자가 사용자에게 미션 제공

### *2023-09-02*
- Member 색상 추가
  + 멤버 등록시 색상 추가 
- Quest 멤버 생상 표현 및 위치 옮김
  + @이름 내용 - 금액 표기 

### *2023-09-01*

- Member 관리 기능 추가
  + 각 Quest에 멤버 할당 가능
- Point 추가
  + Quest 완료 시 누적되는 포인트 항목 추가
  + 포인트는 음수(-)도 가능
  + 누적되는 포인트는 Member 화면에서 확인 가능

### *2023-08-04*
- 반복 퀘스트의 경우 등록 일 이후로만 표기 되도록 수정 
- 엔터 입력시 2개씩 퀘스트 등록되는 오류 수정

## 기능 소개 

### 날짜(년-월-일) 기준으로 기능 제공

- 반복 퀘스트 등록 / 완료 처리 / 삭제
- 단일 퀘스트 등록 / 완료 처리 / 삭제


## API 

- [nestjs](https://nestjs.com/)

### 테이블 생성

```bash
# migration
$ npm run typeorm migration:run
# drop
$ npm run typeorm schema:drop
```
### 설정 파일

> Firebase console > 프로젝트 설정 > 서비스 계정 > Firebase Admin SDK의 Node.js 새 비공개 키 생성 후 해당 파일을 `api/src/firebase/firebase.config.json` 위치에 넣어야 합니다. 


### 실행

```bash
# api 로 이동
$ cd api
# library 설치
$ npm install
# 서버 기동
$ npm run start
```
## WEB

- [nextjs](https://nextjs.org/)

### 설정 파일

>  _env => .env 로 이름 변경 후 알맞은 값으로 설정 한다. 
기본적으로 Firebase console > 프로젝트 설정 > 내 앱 을 추가하고 구성을 보면, 설정 값들이 표기 됩니다 

API 서버의 주소가 확인 되면, `NEXT_PUBLIC_API_HOST=` 에 해당 주소 값을 설정합니다 .

### 실행

```bash
# web 로 이동
$ cd web
# library 설치
$ npm install
# 서버 기동
$ npm run dev
```

## 스크린 샷

![](/screenshot/todo.png)
![](/screenshot/member.png)
![](/screenshot/manager.png)
![](/screenshot/push.jpg)

