import { API_RESPONSE } from '../../../../core';
import { HttpResponse, HttpRequest } from '../../../../core/libs/ApiEvent';
import { Response } from 'express';

import { Response200 } from './response';
import { HealthcheckAction } from './action';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const action = new HealthcheckAction();
        const data = await action.execute(req);

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
    //     await Mysql.closeConnection();
    // }
}
