import { API_RESPONSE } from '../../../../../core';
import { HttpResponse, HttpRequest } from '../../../../../core/libs/ApiEvent';
import { Response } from 'express';

import { Response200 } from './response';
import { Validate } from './validate';
import { SocketioTestAction } from './action';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);
        /**
         * FOR IMAGE
         * if (req.files?.SocketioTest) request.SocketioTest = req.files.SocketioTest;
         * Object req.files.SocketioTest
         * name: String
         * mv: Void
         * mimetype: String
         * data: StringBuffer
         * tempFilePath: string
         * truncated: Boolean
         * size: Number
         * md5: String
         */
        const action = new SocketioTestAction(req);
        await action.execute(request);

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
