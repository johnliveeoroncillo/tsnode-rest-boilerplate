import { env } from '../libs/Env';
import { Database, Dialect } from '../libs/Database';

export class Mongo extends Database {
    protected static host = env('MONGO_HOST', '127.0.0.1');
    protected static port = Number(env('MONGO_PORT', 27017));
    protected static username: string = env('MONGO_USERNAME', '');
    protected static password: string = env('MONGO_PASSWORD', '');
    protected static db: string = env('MONGO_DB', '');
    protected static dialect = Dialect.mongodb;
}
