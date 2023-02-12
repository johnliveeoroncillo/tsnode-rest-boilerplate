import { Connection } from 'typeorm';
import { SampleMongoRepository } from '../../../../../repository/SampleMongoRepository';
import { NotFound } from './response';

export class SampleMongoDeleteAction {
    private sampleMongoRepository: SampleMongoRepository;

    constructor(connection: Connection) {
        this.sampleMongoRepository = connection.getCustomRepository(SampleMongoRepository);
    }

    async execute(id: string): Promise<void> {
        const data = await this.sampleMongoRepository.findCollection(id);
        if (!data) throw new NotFound();

        await this.sampleMongoRepository.softDeleteCollection(id);
    }
}
