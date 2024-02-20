import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMemberReq1693462236481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table member_req (
            seq integer primary key autoincrement,
            user_seq integer not null,
            manager_seq integer null,
            name varchar(100) not null,
            accept_yn varchar(1) not null default 'N',
            use_yn varchar(1) not null default 'Y',
            reg_dtm datetime,
            mod_dtm datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table member_req;`);
  }
}
