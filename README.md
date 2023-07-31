# [Daily Quests](http://52.78.54.82:6001/)


> 사랑하는 딸 아이가 매일 해야할 일을 정리 할 수 있도록 만든 웹 입니다. 


## API 

- [nestjs](https://nestjs.com/)

### 테이블 생성

```bash
# migration
$ npm run typeorm migration:run
# drop
$ npm run typeorm schema:drop
```

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

## 마치며, 

딸을 위한 조그마한 선물로 진행한 프로젝트 입니다.

딸이 원하는 UI 형태로 이쁘게(?) 꾸며질 예정입니다 

