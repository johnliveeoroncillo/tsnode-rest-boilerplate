import { env } from '../libs/Env';
import { Database, Dialect } from '../libs/Database';

export class Postgres extends Database {
    protected static host = env('POSTGRES_HOST', '127.0.0.1');
    protected static port = Number(env('POSTGRES_PORT', 5432));
    protected static username: string = env('POSTGRES_USERNAME', '');
    protected static password: string = env('POSTGRES_PASSWORD', '');
    protected static db: string = env('POSTGRES_DB', '');
    protected static dialect = Dialect.postgres;
}
