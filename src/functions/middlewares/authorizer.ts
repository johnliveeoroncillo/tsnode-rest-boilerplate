import { Response, Request, NextFunction } from 'express';
import { API_RESPONSE } from '../../../core';
import { MissingAuthToken } from '../../../core/defaults';
import { TokenService } from '../../../core/libs/TokenService';
import { Authorize, TokenData } from '../../../core/libs/ApiEvent';

export async function execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        console.log('INVOKING CLIENT AUTHORIZER');
        const authToken = req.headers?.authorization ?? '';
        const token = authToken.replace(/Bearer/g, '').trim();
        if (token == '') throw new MissingAuthToken();

        const jwt: TokenData = await TokenService.verifyClientToken(token);
        return Authorize(jwt, req, next);
    } catch (e) {
        API_RESPONSE(e, res);
    }
}
