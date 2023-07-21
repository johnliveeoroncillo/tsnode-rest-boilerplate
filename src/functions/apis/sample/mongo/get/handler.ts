import { API_RESPONSE } from '../../../../../../core';
import { HttpResponse, HttpRequest } from '../../../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Mysql } from '../../../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { SampleMongoGetAction } from './action';
import { Mongo } from '../../../../../../core/databases/Mongo';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const connection: Connection = await Mongo.getConnection();
        const action = new SampleMongoGetAction(connection);
        const data = await action.execute();

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
