import { API_RESPONSE } from "../../core";
import { HttpResponse, HttpRequest } from "../../core/libs/ApiEvent";
import { Response } from "express";

import { Response200 } from "./response";
import { Validate } from "./validate";
import { RedisInsertAction } from "./action";
import { Redis } from "../../core/databases/Redis";

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);
        const redis = new Redis();
        const action = new RedisInsertAction(redis);
        const data = await action.execute(request);
        
        return API_RESPONSE({
            ...Response200.SUCCESS,
            data,
        }, res);
    }
    catch(e) {
        return API_RESPONSE(e, res);
    }
}
