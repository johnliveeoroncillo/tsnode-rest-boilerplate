import { API_RESPONSE } from '../../../../core';
import { HttpRequest, HttpResponse } from '../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Mysql } from '../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { ProfileReadAction } from './action';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const id = req.identity?.id ?? '';
        const uuid = req.identity?.uuid ?? '';

        const connection: Connection = await Mysql.getConnection();
        const action = new ProfileReadAction(connection);
        const data = await action.execute(id, uuid);

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
