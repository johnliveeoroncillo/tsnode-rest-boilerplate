import { EntityRepository, ObjectID, Repository } from 'typeorm';
import { MongoBaseRepository } from '../../core/libs/MongoBaseRepository';
import { RegionMongoModel } from '../models/RegionMongoModel';

@EntityRepository(RegionMongoModel)
export class RegionMongoRepository extends MongoBaseRepository<RegionMongoModel> {}
