import { API_RESPONSE } from '../../../../core';
import { HttpResponse, HttpRequest } from '../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Response200 } from './response';
import { invokeEvent, invokeEventWithResponse } from '../../../../core/libs/Events2';
import { EVENTS } from '../../../helpers/Enums';
import { Logger } from '../../../../core/libs/Logger';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        
        /**
         * WITHOUT RESPONSE
         */
        const response = await invokeEvent(EVENTS.EVENT_TEST, {
            message: 'test',
        });
        /**
         * RESPONSE result undefined
         */
        Logger.info('event', response);


        // /**
        //  * WITH RESPONSE
        //  */
        // const with_response = await invokeEventWithResponse(EVENTS.EVENT_TEST, {
        //     message: 'test',
        // });
        // /**
        //  * RESPONSE result not undefined
        //  */
        // Logger.info('event', with_response);

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
