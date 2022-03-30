import { Connection } from 'typeorm';
import { EventlogsModel } from '../../../models/EventlogsModel';
import { EventlogsRepository } from '../../../repository/EventlogsRepository';
import { EventTestRequest } from './request';

export class EventTestAction {
    private eventLogsRepository: EventlogsRepository;
    constructor(connection: Connection) {
        this.eventLogsRepository = connection.getCustomRepository(EventlogsRepository);
    }

    async execute(request: EventTestRequest): Promise<EventlogsModel[]> {
        const data: EventlogsModel[] = [];
        for (let i = 1; i <= 50; i++) {
            const log = new EventlogsModel();
            log.message = request.message + '-' + i;
            data.push(log);
        }
        return await this.eventLogsRepository.save(data);
    }
}
