import {
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

export class MongoModel extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 50,
    })
    @Generated('uuid')
    public readonly uuid!: string;

    @ObjectIdColumn()
    id: ObjectId;

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
