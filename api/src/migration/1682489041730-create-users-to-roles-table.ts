import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersToRolesTable1682489041730
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table users_to_roles (
            user_id integer references users (id),
            role_id integer references roles (id),
            created_at datetime,
            updated_at datetime
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table users_to_roles;`);
  }
}
