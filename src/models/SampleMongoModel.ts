import { Entity, Column } from 'typeorm';
import { MongoModel } from '../../core/libs/MongoModel';
// import { MongoModel } from '../../core/libs/MongoModel';
@Entity({
    name: 'TestMongo',
})
export class SampleMongoModel extends MongoModel {
    @Column()
    name: string;
}
