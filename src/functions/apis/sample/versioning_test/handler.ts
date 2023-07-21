import { API_RESPONSE } from '../../../../../core';
import { HttpResponse, HttpRequest } from '../../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Mysql } from '../../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        return API_RESPONSE(
            {
                ...Response200.SUCCESS,
            },
            res,
        );
    } catch (e) {
        return API_RESPONSE(e, res);
    }
    // finally {
    //     await Mysql.closeConnection();
    // }
}
