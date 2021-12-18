import { generateRoute, API_RESPONSE } from "../../core";
import { Request, Response, NextFunction } from "express";
import { Database } from "../../core/database";
import { Connection } from "typeorm";

import * as responses from "../../core/defaults";
import { Validate } from "./validate";
import { LoginAction } from "./action";

export async function execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const request = Validate(req.body);

        const database = new Database();
        const connection: Connection = await database.getConnection();  
        const action = new LoginAction(connection);
        await action.execute(request);

        API_RESPONSE({
            ...responses.Response200
        }, res);
    }
    catch(e) {
        API_RESPONSE(e, res);
    }
}