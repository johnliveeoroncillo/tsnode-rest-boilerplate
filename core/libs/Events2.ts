import fs from 'fs';
import path, { resolve } from 'path';
import { LogColor, Logger } from './Logger';
import { getConfig } from '..';
import { Worker, WorkerOptions } from 'worker_threads';
import { Request } from 'express';

interface EventList {
    [key: string]: EventListConfig;
}

interface EventListConfig {
    handler: string;
    enabled: boolean;
    location: string;
}

interface EventData {
    event_name: string;
    payload?: string;
    withResponse: boolean;
}

export class Events2 {
    private event_path: string;
    private worker: Worker;
    private request: Request | undefined;

    constructor(request?: Request) {
        this.event_path = __dirname + '/../../src/functions/events';
        this.request = request;
    }

    async listEvents(event_name: string): Promise<EventList> {
        let paths: EventList = {};
        const event_path = path.join(this.event_path, event_name);
        if (!fs.existsSync(event_path)) return {};
        console.log(LogColor.bg.yellow, LogColor.fg.black, 'EVENTS: ', LogColor.reset);
        if (fs.existsSync(event_path + '/config.yml')) {
            const config = getConfig(`${event_path}/config.yml`);
            const enabled = config[event_name].enabled ?? false;
            if (enabled) {
                config[event_name].location = event_path;
                console.log('', LogColor.fg.yellow, '- ' + Object.keys(config)[0], LogColor.reset);
                console.log('', LogColor.fg.yellow, '-- ' + config[event_name].handler, LogColor.reset);
                console.log('', LogColor.fg.yellow, '-- ' + config[event_name].location, LogColor.reset);
                paths = config[event_name];
            }
        }

        return paths;
    }
}

export const invokeEvent = async (event_name: string, payload?: any): Promise<void> => {
    return await emit(event_name, payload);
};

export const invokeEventWithResponse = async (event_name: string, payload?: any): Promise<void> => {
    return await emit(event_name, payload, true);
};

const emit = async (event_name: string, payload?: string, withResponse = false): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const event = new Events2();
        const event_data = await event.listEvents(event_name);
        if (event_data.enabled && event_data.handler) {
            // const { execute } = await import(`../.${event_data.handler}`);
            const worker = workerTs(path.resolve(__dirname, './EventWorker.ts'), {});
            worker.postMessage({
                event: event_data,
                data: payload,
            });

            if (withResponse)
                worker.on('message', (payload: any) => {
                    resolve(payload);
                });
            else resolve(undefined);

            worker.on('error', (payload: any) => {
                reject(payload);
            });
            // const response = await execute(payload);
        }
    });
};

const workerTs = (file: string, wkOpts: WorkerOptions) => {
    wkOpts.eval = true;
    if (!wkOpts.workerData) {
        wkOpts.workerData = {};
    }
    wkOpts.workerData.__filename = file;
    return new Worker(
        `
            const wk = require('worker_threads');
            require('ts-node').register();
            let file = wk.workerData.__filename;
            delete wk.workerData.__filename;
            require(file);
        `,
        wkOpts,
    );
};

// try {
//     const { payload, event_name, withResponse } = JSON.parse(data);
//     const event = events[event_name];
//     if (!event) return socket.write(JSON.stringify({ code: 404, message: 'Event not found' }));

//     const { execute } = await import(`../.${event.handler}`);
//     const response = await execute(payload);
//     if (withResponse) socket.write(JSON.stringify(response));
//     socket.destroy();
// } catch (err: any) {
//     socket.write(JSON.stringify({ code: 500, message: err?.message }));
// }
