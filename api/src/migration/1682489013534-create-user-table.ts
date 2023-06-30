import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1682489013534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table users (
            id integer primary key autoincrement,
            username  varchar(300) not null unique,
            password varchar(500) not null,
            created_at datetime,
            updated_at datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table users;');
  }
}
