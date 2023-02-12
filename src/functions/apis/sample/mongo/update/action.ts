import { Connection } from 'typeorm';
import { SampleMongoModel } from '../../../../../models/SampleMongoModel';
import { SampleMongoRepository } from '../../../../../repository/SampleMongoRepository';
import { SampleMongoUpdateRequest } from './request';
import { NotFound } from './response';

export class SampleMongoUpdateAction {
    private sampleMongoRepository: SampleMongoRepository;

    constructor(connection: Connection) {
        this.sampleMongoRepository = connection.getCustomRepository(SampleMongoRepository);
    }

    async execute(request: SampleMongoUpdateRequest, id: string): Promise<SampleMongoModel | undefined> {
        const data = await this.sampleMongoRepository.findCollection(id);
        if (!data) throw new NotFound();
        data.name = request.name;

        return await this.sampleMongoRepository.updateByIdAndReturn(id, data);
    }
}
