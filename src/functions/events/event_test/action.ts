import { Connection } from 'typeorm';
import { EventlogsModel } from '../../../models/EventlogsModel';
import { EventlogsRepository } from '../../../repository/EventlogsRepository';
import { EventTestRequest } from './request';
import axios from 'axios';
import { Logger } from '../../../../core/libs/Logger';
export class EventTestAction {
    private eventLogsRepository: EventlogsRepository;
    constructor(connection: Connection) {
        this.eventLogsRepository = connection.getCustomRepository(EventlogsRepository);
    }

    async execute(request: EventTestRequest): Promise<EventlogsModel[]> {
        // const data: EventlogsModel[] = [];
        // for (let i = 1; i <= 50; i++) {
        //     const log = new EventlogsModel();
        //     log.message = request.message + '-' + i;
        //     data.push(log);
        // }
        // return await this.eventLogsRepository.save(data);
        const client = axios.create({});
        const events: EventlogsModel[] = [];

        await client
            .get(`https://raw.githubusercontent.com/json-iterator/test-data/master/large-file.json`)
            .then(async (res: any) => {
                const { data } = res;
                if (data.length) {
                    data.forEach((element: any) => {
                        const event = new EventlogsModel();
                        event.message = JSON.stringify(element);
                        events.push(event);
                    });
                }
            })
            .catch((err: any) => {
                Logger.error('error', err);
            });
        return await this.eventLogsRepository.save(events);
    }
}
