import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDailyTodoTable1682489032911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table daily_todo (
            seq integer primary key autoincrement,
            user_seq integer not null,
            content varchar(2000) not null,
            use_yn varchar(1) not null  default 'Y',
            reg_dtm datetime,
            mod_dtm datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table daily_todo;`);
  }
}
