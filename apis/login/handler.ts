import { generateRoute, API_RESPONSE } from "../../core";
import { HttpResponse } from "../../core/libs/ApiEvent";
import { Request, Response, NextFunction } from "express";
import { Database } from "../../core/database";
import { Connection } from "typeorm";

import * as responses from "../../core/defaults";
import { Validate } from "./validate";
import { LoginAction } from "./action";
import { TokenService } from "../../core/libs/TokenService";

export async function execute(req: Request, res: Response, next: NextFunction): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);

        const user_data = TokenService.getUserData(req);
        const connection: Connection = await Database.getConnection();  
        const action = new LoginAction(connection);
        const { token } = await action.execute(request);
        
        return API_RESPONSE({
            ...responses.Response200,
            token,
        }, res);
    }
    catch(e) {
        return API_RESPONSE(e, res);
    }
    finally {
        console.log('close');
        await Database.closeConnection();
    }
}