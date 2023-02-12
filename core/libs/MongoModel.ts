import {
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    ObjectIdColumn,
    ObjectID,
    BeforeInsert,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 } from 'uuid';
export class MongoModel extends BaseEntity {
    @Column()
    @Generated('uuid')
    uuid: string;

    @ObjectIdColumn()
    _id: ObjectID;

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
