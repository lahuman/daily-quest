import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRoles1682489060364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        insert into roles (name) values ('user'), ('admin');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
