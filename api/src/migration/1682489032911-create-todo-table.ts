import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoTable1682489032911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table todo (
            seq integer primary key autoincrement,
            user_seq integer not null,
            daily_todo_seq integer,
            content varchar(2000),
            type varchar(4) not null default 'T',
            todo_day varchar(8),
            complete_yn varchar(1),
            use_yn varchar(1) not null default 'Y',
            reg_dtm datetime,
            mod_dtm datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table todo;`);
  }
}
