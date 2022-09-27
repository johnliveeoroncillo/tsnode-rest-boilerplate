import { createServer, Socket, Server } from 'net';
import { TextDecoder } from 'util';
import { env } from './Env';
import fs from 'fs';
import path from 'path';
import { getConfig } from '..';
import { LogColor, Logger } from './Logger';

const event_path = __dirname + '/../../src/functions/events';
const EVENT_PORT = Number(env('PORT', 6060)) + 1; //ADD 1 TO PREVENT PORT CONFLICT
interface Options {
    host?: string;
    port?: number;
}

enum LISTENERS {
    connection = 'connection',
    data = 'data',
    close = 'close',
}

interface responseOptions {
    code: number;
    message: string;
}

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

export class Response {
    code: number;
    message: string;
    constructor(options: responseOptions) {
        this.code = options.code;
        this.message = options.message;
    }
}

export class Events {
    private defaultOptions: Options = {
        host: env('EVENT_HOST', '127.0.0.0'),
        port: EVENT_PORT,
    };
    private options: Options;
    private serverEvent: Server;

    constructor(options?: Options) {
        // console.log('EVENT ACTIVATED');
        this.options = { ...this.defaultOptions, ...options };
        this.serverEvent = createServer();
    }

    private async listEvents(): Promise<EventList> {
        let paths: EventList = {};

        if (!fs.existsSync(event_path)) return {};

        console.log(LogColor.bg.yellow, LogColor.fg.black, 'EVENTS : ' + this.options.port, LogColor.reset);
        fs.readdirSync(event_path).forEach((file: string) => {
            const absolute = path.join(event_path, file);

            if (fs.statSync(absolute).isDirectory()) {
                if (fs.existsSync(absolute)) {
                    const config = getConfig(`${absolute}/config.yml`);
                    const enabled = config?.enabled ?? false;
                    if (enabled) {
                        config[file].location = absolute;
                        console.log('', LogColor.fg.yellow, '- ' + Object.keys(config)[0], LogColor.reset);
                        console.log('', LogColor.fg.yellow, '-- ' + config[file].handler, LogColor.reset);
                        paths = Object.assign(paths, config);
                    }
                }
            }
        });

        return paths;
    }

    async startServer(): Promise<void> {
        // console.log('EVENT STARTING SERVER');
        const events: EventList = await this.listEvents();

        this.serverEvent.listen(this.options.port, this.options.host);
        this.on(LISTENERS.connection, function (socket) {
            // console.log('EVENT CLIENT CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
            socket.on(LISTENERS.data, async (socket_data: ArrayBuffer) => {
                const data = decode(socket_data);

                try {
                    const { payload, event_name, withResponse } = JSON.parse(data);
                    const event = events[event_name];
                    if (!event) return socket.write(JSON.stringify({ code: 404, message: 'Event not found' }));

                    const { execute } = await import(`../.${event.handler}`);
                    const response = await execute(payload);
                    if (withResponse) socket.write(JSON.stringify(response));
                    socket.destroy();
                } catch (err: any) {
                    socket.write(JSON.stringify({ code: 500, message: err?.message }));
                }
                console.log('EVENT SERVER RECEIVED', data);
            });
        });
    }

    get eventOptions(): Options {
        return this.options;
    }

    on(listeners: LISTENERS, callback: (data: any) => any): void {
        this.serverEvent.on(listeners, callback);
    }

    stopServer(): void {
        // console.log('EVENT STOPPING SERVER');
        this.serverEvent.close();
    }
}

const decode = (data: ArrayBuffer): string => {
    const enc = new TextDecoder('utf-8');
    const arr = new Uint8Array(data);
    return enc.decode(arr);
};

const invokeEvent = async (event_name: string, payload?: any): Promise<void> => {
    return await emit(event_name, payload);
};

const invokeEventWithResponse = async (event_name: string, payload?: any): Promise<void> => {
    return await emit(event_name, payload, true);
};

const emit = (event_name: string, payload?: string, withResponse = false): Promise<void> => {
    return new Promise((resolve) => {
        const socket = new Socket();
        socket.connect(EVENT_PORT, env('EVENT_HOST', '127.0.0.1'), function () {
            Logger.info('EVENT CLIENT', 'STARTED');
            const eventData: EventData = {
                event_name,
                payload,
                withResponse,
            };
            // console.log('EVENT CLIENT CONNECTED', eventData);
            socket.write(JSON.stringify(eventData));
            if (!withResponse) resolve();
        });

        if (withResponse)
            socket.on(LISTENERS.data, (server_data) => {
                const data = decode(server_data);
                Logger.info('EVENT CLIENT RECEIVED', data);
                resolve(JSON.parse(data));
            });

        socket.on(LISTENERS.close, () => {
            Logger.info('EVENT CLIENT', 'DESTROYED');
        });
    });
};
export { invokeEvent, invokeEventWithResponse };
