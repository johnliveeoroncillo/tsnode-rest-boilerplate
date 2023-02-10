import { Entity, Column } from 'typeorm';
import { Model } from '../../core/libs/Model';
// import { MongoModel } from '../../core/libs/MongoModel';
@Entity({
    name: 'Regions',
})
export class RegionMongoModel extends Model {
    @Column()
    region: string;

    @Column()
    zip_code: number;
}
