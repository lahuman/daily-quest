# [Full Stack NestJS + NextJS JWT Authentication Tutorial](https://www.youtube.com/watch?v=Hbj_Wdqk3MM&t=206s)

## 사용 모듈
 - nestjs

## 테이블 마이그레이션 or 드롭

```bash
# migration
$ npm run typeorm migration:run
# drop
$ npm run typeorm schema:drop
```

### create migration file

```bash
$  npx typeorm migration:create src/migration/insert-users
```