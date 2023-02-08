import { Request } from 'express';
import { Connection } from 'typeorm';
import { SOCKETS } from '../../../helpers/Enums';
import { SocketioTestRequest } from './request';

export class SocketioTestAction {
    private req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    async execute(request: SocketioTestRequest): Promise<void> {
        const io = this.req.app.get('socketio');
        io.broadcastAll(SOCKETS.SOCKET_TEST, request);
    }
}
