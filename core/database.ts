import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from "typeorm";

interface ActiveConnections {
  [key: string]: Connection;
}


let active: ActiveConnections = {};
export class Database {
  private static host = process.env.DB_HOST;
  private static username = process.env.DB_USERNAME;
  private static password = process.env.DB_PASSWORD;
  private static db = process.env.DB_NAME;

  // private connectionManager: ConnectionManager;

  // constructor() {
  //   this.connectionManager = getConnectionManager();
  // }

  static async getConnection(conn = 'default'): Promise<Connection> {
    console.log(active);
    if (typeof active[conn] === 'undefined') {
        const connectionOptions: ConnectionOptions = {
          name: "default",
          type: "mysql",
          host: this.host,
          port: 3306,
          username: this.username,
          password: this.password,
          database: this.db,
          synchronize: false,
          logging: true,
          entities: ["./models/**/*.ts"],
          migrations: ["./migrations/**/*.ts"],
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
