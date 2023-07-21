import { API_RESPONSE } from '../../../../../../core';
import { HttpResponse, HttpRequest } from '../../../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Mysql } from '../../../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { SampleMongoDeleteAction } from './action';
import { Mongo } from '../../../../../../core/databases/Mongo';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const params = String(req.params?.id ?? '');
        const connection: Connection = await Mongo.getConnection();
        const action = new SampleMongoDeleteAction(connection);
        await action.execute(params);

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
