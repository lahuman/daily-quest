import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDailyTodoTable1682489032911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table daily_todo (
            seq integer primary key autoincrement,
            user_seq integer not null,
            member_seq integer null,
            point integer not null default 0,
            type varchar(2) not null default 'ED', 
            content varchar(2000) not null,
            start_day integer not null,
            use_yn varchar(1) not null  default 'Y',
            reg_dtm datetime,
            mod_dtm datetime
        );
        create index idx_daily_todo_01 on daily_todo(start_day);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table daily_todo;`);
  }
}
