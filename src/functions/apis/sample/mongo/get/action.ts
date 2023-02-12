import { Connection } from 'typeorm';
import { SampleMongoModel } from '../../../../../models/SampleMongoModel';
import { SampleMongoRepository } from '../../../../../repository/SampleMongoRepository';

export class SampleMongoGetAction {
    private sampleMongoRepository: SampleMongoRepository;

    constructor(connection: Connection) {
        this.sampleMongoRepository = connection.getCustomRepository(SampleMongoRepository);
    }

    async execute(): Promise<SampleMongoModel[]> {
        return await this.sampleMongoRepository.findCollections();
    }
}
