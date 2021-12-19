import { generateRoute, API_RESPONSE } from "../../core";
import { HttpResponse } from "../../core/libs/ApiEvent";
import { Request, Response, NextFunction } from "express";
import { Database } from "../../core/database";
import { Connection } from "typeorm";

import * as responses from "../../core/defaults";
import { Validate } from "./validate";
import { LoginAction } from "./action";

export async function execute(req: Request, res: Response, next: NextFunction): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);

        const connection: Connection = await Database.getConnection();  
        const action = new LoginAction(connection);
        await action.execute(request);

        return API_RESPONSE({
            ...responses.Response200
        }, res);
    }
    catch(e) {
        return API_RESPONSE(e, res);
    }
    finally {
        await Database.closeConnection();
    }
}