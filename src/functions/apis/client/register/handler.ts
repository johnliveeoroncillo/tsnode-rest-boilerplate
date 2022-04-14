import { API_RESPONSE } from '../../../../../core';
import { HttpResponse } from '../../../../../core/libs/ApiEvent';
import { Request, Response } from 'express';
import { Mysql } from '../../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { Validate } from './validate';
import { RegisterAction } from './action';

export async function execute(req: Request, res: Response): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);
        const connection: Connection = await Mysql.getConnection();
        const action = new RegisterAction(connection);
        const data = await action.execute(request);
        return API_RESPONSE(
            {
                ...Response200.SUCCESS,
                data,
            },
            res,
        );
    } catch (e) {
        return API_RESPONSE(e, res);
    } finally {
        await Mysql.closeConnection();
    }
}
