import {
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
} from 'typeorm';
export class Model extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 50,
    })
    @Generated('uuid')
    public readonly uuid!: string;

    @PrimaryGeneratedColumn()
    public readonly id!: number;

    // timestamps
    @CreateDateColumn({
        type: 'timestamp',
    })
    created_at: string;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updated_at: string;

    @DeleteDateColumn({
        type: 'varchar',
    })
    deleted_at?: Date;
}
