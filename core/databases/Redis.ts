/* eslint-disable @typescript-eslint/no-var-requires */
const predis = require('predis');

const REDIS_PORT = process.env.REDIS_PORT ?? '6379';
const REDIS_HOST = process.env.REDIS_HOST ?? '127.0.0.1';
const TTL = process.env.REDIS_TTL ?? 3600;

export class Redis {
    protected client: any;

    constructor() {
        this.client = predis.createClient({
            port: REDIS_PORT,
            server: REDIS_HOST,
        });
    }

    public async get(keys: string): Promise<any> {
        return this.client.get(keys);
    }

    public async setex(keys: any, data: any, ttl = TTL): Promise<any> {
        return await this.client.setex(keys, ttl, data);
    }
}
