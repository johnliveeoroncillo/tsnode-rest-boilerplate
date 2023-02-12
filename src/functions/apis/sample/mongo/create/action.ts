import { Connection } from 'typeorm';
import { SampleMongoModel } from '../../../../../models/SampleMongoModel';
import { SampleMongoRepository } from '../../../../../repository/SampleMongoRepository';
import { SampleMongoCreateRequest } from './request';

export class SampleMongoCreateAction {
    private sampleMongoRepository: SampleMongoRepository;

    constructor(connection: Connection) {
        this.sampleMongoRepository = connection.getCustomRepository(SampleMongoRepository);
    }

    async execute(request: SampleMongoCreateRequest): Promise<SampleMongoModel> {
        const data = new SampleMongoModel();
        data.name = request.name;

        return await this.sampleMongoRepository.save(data);
    }
}
