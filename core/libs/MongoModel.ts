import {
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    ObjectIdColumn,
    ObjectID,
} from 'typeorm';
export class MongoModel extends BaseEntity {
    @Column()
    @Generated('uuid')
    uuid: string;

    @ObjectIdColumn()
    public readonly id!: ObjectID;

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
    deleted_at?: string;
}
