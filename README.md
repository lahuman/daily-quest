# [일일 퀘스트](https://d-q.duckdns.org)

> 매일 퀘스트를 수행하여 더 나은 내가 되어보세요.

[일일 퀘스트 바로 가기](https://d-q.duckdns.org)

## 업데이트 내역

### *2024-04-08*
- 반복 기능 개선
  + 평일과 휴일 구분 추가

### *2024-03-04*
- 웹 푸시 기능 추가
  + 관리 요청, 수락, 반려 시 알림 발송
  + 할 일 등록, 완료, 취소 시 알림 발송
- 계정 간 관리자 명칭 기능 추가
- 운영 서버 변경
- 디자인 개선

### *2023-12-31*
- 계정 간 담당자 지정 기능 추가
- 담당자가 사용자에게 미션 제공

### *2023-09-02*
- 멤버 색상 추가
  + 멤버 등록 시 색상 추가
- 퀘스트 멤버 색상 표현 및 위치 변경
  + @이름 내용 - 금액 표기

### *2023-09-01*
- 멤버 관리 기능 추가
  + 각 퀘스트에 멤버 할당 가능
- 포인트 추가
  + 퀘스트 완료 시 누적되는 포인트 항목 추가
  + 포인트는 음수(-)도 가능
  + 누적 포인트는 멤버 화면에서 확인 가능

### *2023-08-04*
- 반복 퀘스트는 등록일 이후로만 표시되도록 수정
- 엔터 입력 시 퀘스트가 두 개씩 등록되는 오류 수정

## 기능 소개

### 날짜(년-월-일) 기준으로 기능 제공

- 반복 퀘스트 등록, 완료 처리, 삭제
- 단일 퀘스트 등록, 완료 처리, 삭제

## API

- [nestjs](https://nestjs.com/)

### 테이블 생성

```bash
# 마이그레이션 실행
$ npm run typeorm migration:run
# 스키마 삭제
$ npm run typeorm schema:drop
```

### 설정 파일

> Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > Firebase Admin SDK의 Node.js 새 비공개 키 생성 후 해당 파일을 `api/src/firebase/firebase.config.json` 위치에 넣어야 합니다.

### 실행

```bash
# api 디렉토리로 이동
$ cd api
# 라이브러리 설치
$ npm install
# 서버 시작
$ npm run start
```

## 웹

- [nextjs](https://nextjs.org/)

### 설정 파일

> _env 파일을 .env로 이름 변경 후 적절한 값으로 설정합니다. 기본적으로 Firebase 콘솔 > 프로젝트 설정 > 내 앱을 추가하고 구성을 보면 설정 값들이 표시됩니다.

API 서버의 주소를 확인한 후, `NEXT_PUBLIC_API_HOST=`에 해당 주소 값을 설정합니다.

### 실행

```bash
# web 디렉토리로 이동
$ cd web
# 라이브러리 설치
$ npm install
# 서버 시작
$ npm run dev
```

## 스크린샷

![](/screenshot/todo.png)
![](/screenshot/member.png)
![](/screenshot/manager.png)
![](/screenshot/push.jpg)

