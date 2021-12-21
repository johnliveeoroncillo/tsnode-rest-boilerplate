import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from "typeorm";

export class Model extends BaseEntity {
  @Column({
      type: "varchar",
      length: 50
  })
  @Generated("uuid")
  public readonly uuid!: string;

  @PrimaryGeneratedColumn()
  public readonly id!: number;

  // timestamps
  @CreateDateColumn({
      type: 'varchar',
  })
  public created_at: string;

  @UpdateDateColumn({
      type: 'varchar',
  })
  public updated_at: string;

  @DeleteDateColumn({
      type: 'varchar',
  })
  public deleted_at?: Date;
}
