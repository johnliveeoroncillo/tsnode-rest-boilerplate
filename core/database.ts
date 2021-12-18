import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from "typeorm";

export class Database {
  private host = process.env.DB_HOST;
  private username = process.env.DB_USERNAME;
  private password = process.env.DB_PASSWORD;
  private db = process.env.DB_NAME;

  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(name = 'default'): Promise<Connection> {
    const CONNECTION_NAME: string = name;
    let connection: Connection;
    const hasConnection = this.connectionManager.has(CONNECTION_NAME);
    if (hasConnection) {
      connection = this.connectionManager.get(CONNECTION_NAME);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
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
      connection = await createConnection(connectionOptions);
    }
    return connection;
  }
}
