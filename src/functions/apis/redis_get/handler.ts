import { API_RESPONSE } from '../../core';
import { HttpResponse, HttpRequest } from '../../core/libs/ApiEvent';
import { Response } from 'express';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { RedisGetAction } from './action';
import { Redis } from '../../core/databases/Redis';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const redis: Redis = new Redis();
        const key = req.params?.key ?? '';
        const action = new RedisGetAction(redis);
        const data = await action.execute(key);

        return API_RESPONSE(
            {
                ...Response200.SUCCESS,
                data,
            },
            res,
        );
    } catch (e) {
        return API_RESPONSE(e, res);
    }
    // finally {
    //     await Database.closeConnection();
    // }
}
