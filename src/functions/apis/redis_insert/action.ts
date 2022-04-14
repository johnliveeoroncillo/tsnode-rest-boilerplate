import { Redis } from '../../../../core/databases/Redis';
import { RedisInsertRequest } from './request';

export class RedisInsertAction {
    private redis: Redis;

    constructor(redis: Redis) {
        this.redis = redis;
    }

    async execute(request: RedisInsertRequest): Promise<any> {
        const get_cache = await this.redis.get(request.key);
        if (get_cache) return JSON.parse(get_cache);

        await this.redis.setex(request.key, JSON.stringify(request.value));
        return { [request.key]: request.value };
    }
}
