import { API_RESPONSE } from '../../../../core';
import { HttpResponse, HttpRequest } from '../../../../core/libs/ApiEvent';
import { Database } from '../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { Validate } from './validate';
import { EventTestAction } from './action';
import { EventTestRequest } from './request';

export async function execute(event: EventTestRequest): Promise<HttpResponse> {
    try {
        const request = Validate(event);
        const connection: Connection = await Database.getConnection();
        const action = new EventTestAction(connection);
        const data = await action.execute(request);

        return API_RESPONSE({
            ...Response200.SUCCESS,
            data,
        });
    } catch (e) {
        return API_RESPONSE(e);
    }
    // finally {
    //     await Database.closeConnection();
    // }
}
