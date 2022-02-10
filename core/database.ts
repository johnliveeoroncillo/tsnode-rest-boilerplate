import {
  Connection,
  ConnectionOptions,
  createConnection,
} from "typeorm";
import 'dotenv/config';
interface ActiveConnections {
  [key: string]: Connection;
}


let active: ActiveConnections = {};
export class Database {
  private static host: string = process.env?.DB_HOST ?? '';
  private static port = Number(process.env?.DB_PORT ?? 3306);
  private static username: string = process.env?.DB_USERNAME ?? '';
  private static password: string = process.env?.DB_PASSWORD ?? '';
  private static db: string = process.env?.DB_NAME ?? '';
  private static db_logging: boolean = (process.env?.DB_LOGGING ?? false) === 'true';

  // private connectionManager: ConnectionManager;

  // constructor() {
  //   this.connectionManager = getConnectionManager();
  // }

  static async getConnection(conn = 'default'): Promise<Connection> {
    if (typeof active[conn] === 'undefined') {
        const connectionOptions: ConnectionOptions = {
          name: conn,
          type: "mysql",
          host: this.host,
          port: this.port,
          username: this.username,
          password: this.password,
          database: this.db,
          synchronize: false,
          logging: this.db_logging,
          entities: ["./models/**/*.js"],
          migrations: ["./migrations/**/*.js"],
          // subscribers: ['src/subscriber/**/*.js'],
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
