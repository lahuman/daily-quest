import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1682489013534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table user (
            seq integer primary key autoincrement,
            uid  varchar(150) not null unique,
            email  varchar(300) not null unique,
            reg_dtm datetime,
            mod_dtm datetime
        );`);

    for(let i=0; i<10; i++) {
      await queryRunner.query(`
      insert into user (
          uid ,
          email
      ) values ('hello${i}', 'lahuman${i}@haha.com');`);
    }
    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table user;');
  }
}
