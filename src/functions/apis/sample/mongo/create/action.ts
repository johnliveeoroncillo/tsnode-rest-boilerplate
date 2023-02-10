import { Connection } from 'typeorm';
import { SampleMongoCreateRequest } from './request';

export class SampleMongoCreateAction {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: SampleMongoCreateRequest): Promise<void> {}
}
