import { env } from '../libs/Env';
import { Database, Dialect } from '../libs/Database';

export class Mysql extends Database {
    protected static host = env('MYSQL_HOST', '127.0.0.1');
    protected static port = Number(env('MYSQL_PORT', 5432));
    protected static username: string = env('MYSQL_USERNAME', '');
    protected static password: string = env('MYSQL_PASSWORD', '');
    protected static db: string = env('MYSQL_DB', '');
    protected static dialect = Dialect.mysql;
}
