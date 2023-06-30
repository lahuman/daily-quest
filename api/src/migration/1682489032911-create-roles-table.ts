import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1682489032911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table roles (
            id integer primary key autoincrement,
            name varchar(300) not null,
            created_at datetime,
            updated_at datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table roles;`);
  }
}
