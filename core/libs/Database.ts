import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { logMessage } from '..';
import { env } from './Env';
interface ActiveConnections {
    [key: string]: Connection;
}

export enum Dialect {
    mysql = 'mysql',
    postgres = 'postgres',
    mongodb = 'mongodb',
}

let active: ActiveConnections = {};
export class Database {
    protected static host: string = env('MYSQL_HOST', '');
    protected static port = Number(env('MYSQL_PORT', 3306));
    protected static username: string = env('MYSQL_USERNAME', '');
    protected static password: string = env('MYSQL_PASSWORD', '');
    protected static db: string = env('MYSQL_DB', '');
    protected static dialect: Dialect = Dialect.mysql;

    protected static logging: boolean = env('DB_LOGGING', 'false') === 'true';

    static async getConnection(conn = 'default'): Promise<Connection> {
        if (typeof active[conn] === 'undefined') {
            const connectionOptions: ConnectionOptions = {
                name: conn,
                type: this.dialect,
                host: this.host,
                port: this.port,
                username: this.username,
                password: this.password,
                database: this.db,
                synchronize: false,
                logging: this.logging,
                entities: [`${__dirname}/../../src/models/*.{ts,js}`],
            };

            active[conn] = await createConnection(connectionOptions);
        }
        return active[conn];
    }

    static async closeConnection(): Promise<void> {
        const closing: Array<Promise<void>> = [];

        for (const key in active) {
            if (active.hasOwnProperty(key)) {
                const connection: Connection = active[key];
                closing.push(connection.close());
            }
        }

        active = {};

        await Promise.all(closing);
    }
}
