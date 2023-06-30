import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertUsers1682584156903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hash = await bcrypt.hash('password', 10);
    await queryRunner.query(
      `insert into users(username, password) values ('lahuman', '${hash}')`,
    );
    await queryRunner.query(
      `insert into users_to_roles(user_id, role_id) values (1, 2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
