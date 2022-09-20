import { Response, Request, NextFunction } from 'express';
import { API_RESPONSE } from '../../../core';
import { MissingAuthToken } from '../../../core/defaults';
import { TokenService } from '../../../core/libs/TokenService';
import { Authorize, TokenData } from '../../../core/libs/ApiEvent';
import { Logger } from '../../../core/libs/Logger';

export async function execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        console.log('INVOKING SECOND AUTHORIZER');
        return next();
    } catch (e) {
        API_RESPONSE(e, res);
    }
}
