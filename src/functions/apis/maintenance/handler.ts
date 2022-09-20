import { API_RESPONSE } from '../../../../core';
import { HttpResponse, HttpRequest } from '../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Response503 } from '../../../../core/defaults';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        return API_RESPONSE(Response503, res);
    } catch (e) {
        return API_RESPONSE(e, res);
    }
    // finally {
    //     await Mysql.closeConnection();
    // }
}
