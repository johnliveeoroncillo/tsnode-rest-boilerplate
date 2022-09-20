import { parentPort } from 'worker_threads';
import axios from 'axios';
import { Logger } from '../../../../core/libs/Logger';
import { Mysql } from '../../../../core/databases/Mysql';
import { Connection } from 'typeorm';
import { EventlogsRepository } from '../../../repository/EventlogsRepository';
import { EventlogsModel } from '../../../models/EventlogsModel';

parentPort?.on('message', async (payload: any) => {
    const connection: Connection = await Mysql.getConnection();
    const eventLogsRepository: EventlogsRepository = connection.getCustomRepository(EventlogsRepository);

    console.log('worker', payload);

    const client = axios.create({});

    await client
        .get(`https://raw.githubusercontent.com/json-iterator/test-data/master/large-file.json`)
        .then(async (res: any) => {
            const { data } = res;
            if (data.length) {
                const events: EventlogsModel[] = [];
                data.forEach((element: any) => {
                    const event = new EventlogsModel();
                    event.message = JSON.stringify(element);
                    events.push(event);
                });

                await eventLogsRepository.save(events);
            }
        })
        .catch((err: any) => {
            Logger.error('error', err);
        });
    parentPort?.postMessage(payload);
});
