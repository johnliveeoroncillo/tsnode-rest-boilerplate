import fse from 'fs-extra';
import { existsSync } from 'fs';
import { pascalCase, snakeCase } from 'case-anything';

const action = `import { Connection } from 'typeorm';

export class <name>Action {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(payload: any): Promise<void> {}
}
`;

const handler = `import { KeyValue } from '../../../../core/libs/ApiEvent';
import { Mysql } from '../../../../core/databases/Mysql';
import { Connection } from 'typeorm';
import { <name>Action } from './action';
import { SocketIOData } from '../../../../core/libs/SocketIO';

export async function execute(io: SocketIOData, payload: unknown): Promise<KeyValue | string | boolean | number> {
    try {
        const connection: Connection = await Mysql.getConnection();
        const action = new <name>Action(connection);

        /** BROADCAST THE <socket> EVENT TO ALL CLIENTS EXCLUDING SENDER */
        io.socket.broadcast.emit('<socket>', payload);
        return true;
    } catch (e: any) {
        throw new Error(e);
    }
}
`;

const handler_test = `import { env } from '../../../../core/libs/Env';

/** MOCKING CLIENT **/
test('CLIENT: SOCKET.io', async () => {
    const server = "0.0.0.0";  // change it to the address of your server
    const port = env('PORT', 6060); // change it to the port of your server
    const socket = require("socket.io-client")("http://" + server + ":" + port);

    // let response = {};
    // socket.on("new_connection", (data: any) => {
    //     response = data;
    //     expect(response).toHaveProperty('socket_id');

    //     setTimeout(() => {
    //         /**
    //          * SEND TEST EVENT
    //          * ./socket/socket_test
    //          */
    //         socket.emit('socket_test', 'test_payload');
    //     }, 2000);
        
    //     setTimeout(() => {
    //         socket.disconnect();
    //     },10000);
    // });

    // socket.on('test_event', (payload: any) => {
    //     console.log('sent to self', payload);
    // })

    // socket.on('test_all', (payload: any) => {
    //     console.log('sent to all', payload);
    // })

    // socket.on('test_broadcast', (payload: any) => {
    //     console.log('sent to test broadcast', payload);
    // })

    // socket.on('disconnect', () => {
    //     console.log('socket disconnected');
    //     process.exit();
    // })
});
`;

const config = `<name>: 
  handler: ./socket/<name>/handler
  enabled: true
`;

export class SocketTemplate {
    private readonly filename: string;
    private readonly name: string;

    constructor(name: string) {
        this.name = snakeCase(name.trim()); //pluralize(name.trim())
        this.filename = `${this.name}.ts`;
    }

    generate(): void {
        const route = `./src/functions/socket/${this.name}`;
        if (existsSync(route)) throw new Error('Socket event file already existed');

        //ACTION
        fse.outputFileSync(
            `./src/functions/socket/${this.name}/action.ts`,
            action.replace(/<name>/g, pascalCase(this.name)),
        );
        //HANDLER TEST
        fse.outputFileSync(
            `./src/functions/socket/${this.name}/handler_test.ts`,
            handler_test.replace(/<name>/g, pascalCase(this.name)),
        );
        //HANDLER
        fse.outputFileSync(
            `./src/functions/socket/${this.name}/handler.ts`,
            handler.replace(/<name>/g, pascalCase(this.name)).replace(/<socket>/g, this.name),
        );
        //CONFIG
        fse.outputFileSync(`./src/functions/socket/${this.name}/config.yml`, config.replace(/<name>/g, this.name));
    }
}
