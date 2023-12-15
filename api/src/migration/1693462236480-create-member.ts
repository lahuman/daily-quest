import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMember1693462236480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table member (
            seq integer primary key autoincrement,
            user_seq integer not null,
            name varchar(100) not null,
            color varchar(7) not null default '#000000',
            total_point integer not null default 0,
            use_yn varchar(1) not null default 'Y',
            reg_dtm datetime,
            mod_dtm datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table member;`);
  }
}
