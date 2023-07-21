import * as socketio from 'socket.io';
import { LogColor, Logger } from './Logger';
import path from 'path';
import fs from 'fs';
import { getConfig } from '..';

interface SocketList {
    [key: string]: SocketListConfig;
}

interface SocketListConfig {
    handler: string;
    enabled: boolean;
    location: string;
}

export interface SocketIOData {
    socketio: SocketIO;
    socket: socketio.Socket;
}

/**
 * Socket.io
 * Ref: https://socket.io/docs/v3/broadcasting-events/
 */

export class SocketIO {
    private io: socketio.Socket;
    private socket_path: string;
    clients: any = {};
    constructor(server: Express.Application) {
        Logger.info('Socket.io', 'Started');
        this.socket_path = __dirname + '/../../src/functions/socket';
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.io = require('socket.io')(server, {
            cors: {
                methods: ['GET', 'POST'],
            },
        });
        this.init();
    }

    private async init() {
        this.io.on('connect', async (socket: socketio.Socket) => {
            Logger.warning('NEW CONNECTION', socket.id);
            this.clients[socket.id] = socket;

            /**
             * LIST ALL AVAILABLE CUSTOM SOCKET EVENTS
             */
            const socket_events = await this.listSockets();
            if (Object.keys(socket_events).length) {
                for (const key in socket_events) {
                    const socket_key = key;
                    const socket_event = socket_events[socket_key];

                    socket.on(socket_key, async (payload: any) => {
                        const { execute } = await import(`../.${socket_event.handler}`);
                        await execute({ socketio: this, socket }, payload);
                    });
                }
            }

            /**
             * OPTIONAL NOTE:
             * BROADCAST IF NEW CONNECTION HAS BEEN RECEIVED
             * YOU CAN IMPLEMENT YOUR OWN ACTION HERE
             */
            this.broadcastAll('new_connection', { socket_id: socket.id });

            /**
             * BROADCAST IF SOMEONE GOT DISCONNECTED EXCEPT SENDER
             * YOU CAN IMPLEMENT YOUR OWN ACTION HERE
             */
            socket.on('disconnect', () => {
                Logger.error('SOCKET DISCONNECTED', socket.id);

                /** OPTIONAL NOTE: Implement disconnect event on client side */
                // socket.broadcast.emit('disconnect_connection', socket.id)

                delete this.clients[socket.id];
            });
        });
    }

    async listSockets(): Promise<SocketList> {
        let paths: SocketList = {};

        if (!fs.existsSync(this.socket_path)) return {};

        console.log(LogColor.bg.yellow, LogColor.fg.black, 'SOCKETS : ', LogColor.reset);

        fs.readdirSync(this.socket_path).forEach((file: string) => {
            const absolute = path.join(this.socket_path, file);

            if (fs.statSync(absolute).isDirectory()) {
                if (fs.existsSync(absolute)) {
                    const config = getConfig(`${absolute}/config.yml`);
                    const key = Object.keys(config)[0];
                    const enabled = config[key]?.enabled ?? false;
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
    /** Use io.emit to broadcast event to all connected clients */
    broadcastAll(event: string, payload: any): void {
        Logger.info('BROADCASTING', 'Clients: ' + Object.keys(this.clients).length);
        this.io.emit(event, payload);
    }

    /** SEND TO SPECIFIC ID */
    sendToId(socket_id: string, event: string, payload: any): void {
        Logger.info('SENDING TO SPECIFIC ID:', socket_id);
        this.io.to(socket_id).emit(event, payload);
    }
}
