import {
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    ObjectIdColumn,
    ObjectID,
    Index,
} from 'typeorm';
export class MongoModel extends BaseEntity {
    @Index({ unique: true })
    @Column()
    @Generated('uuid')
    uuid: string;

    @ObjectIdColumn()
    public readonly id!: ObjectID;

    // timestamps
    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    @DeleteDateColumn()
    deleted_at?: string;
}
