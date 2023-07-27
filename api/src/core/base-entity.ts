import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({
    type: 'datetime',
    default: () => `datetime('now')`,
  })
  public regDtm: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => `datetime('now')`,
    onUpdate: `datetime('now')`,
  })
  public modDtm: Date;
}
