import { Redis } from "../../core/databases/Redis";
import { KeyNotFound } from "./response";

export class RedisGetAction {
    private redis: Redis;

    constructor(redis: Redis) {
        this.redis = redis;
    }

    async execute(key: string): Promise<any> {
        const get_cache = await this.redis.get(key);
        if(!get_cache) throw new KeyNotFound();

        return JSON.parse(get_cache);
    }
}