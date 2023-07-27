import { BaseEntity } from '../core/base-entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user')
@Unique(['uid'])
export class User extends BaseEntity {
  constructor(data: Partial<User>) {
    super();
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  email: string;

  @Column()
  uid: string;
}
