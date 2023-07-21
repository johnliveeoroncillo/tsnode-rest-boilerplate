import { EntityRepository, ObjectID, Repository } from 'typeorm';
import { MongoBaseRepository } from '../../core/libs/MongoBaseRepository';
import { SampleMongoModel } from '../models/SampleMongoModel';

@EntityRepository(SampleMongoModel)
export class SampleMongoRepository extends MongoBaseRepository<SampleMongoModel> {}
