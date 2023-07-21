import { API_RESPONSE } from '../../../../../../core';
import { HttpResponse, HttpRequest } from '../../../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { Validate } from './validate';
import { SampleMongoCreateAction } from './action';
import { Mongo } from '../../../../../../core/databases/Mongo';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);
        /**
         * FOR IMAGE
         * if (req.files?.SampleMongoCreate) request.SampleMongoCreate = req.files.SampleMongoCreate;
         * Object req.files.SampleMongoCreate
         * name: String
         * mv: Void
         * mimetype: String
         * data: StringBuffer
         * tempFilePath: string
         * truncated: Boolean
         * size: Number
         * md5: String
         */
        const connection: Connection = await Mongo.getConnection();
        const action = new SampleMongoCreateAction(connection);
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
    }
    // finally {
    //     await Mysql.closeConnection();
    // }
}
