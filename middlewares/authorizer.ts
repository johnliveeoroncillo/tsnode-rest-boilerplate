import { Response, Request, NextFunction } from "express";
import { API_RESPONSE } from "../core";
import { MissingAuthToken } from '../core/defaults';
import { TokenService } from '../core/libs/TokenService';


export async function execute(req: Request, res: Response, next:NextFunction):Promise<void> {
    try {
        console.log('INVOKING AUTHORIZER');
        const authToken = req.headers?.authorization ?? '';
        const token = authToken.replace(/Bearer/g, '').trim();
        if(token == '') throw new MissingAuthToken();

        const jwt:any = await TokenService.verifyToken(token);
        req.headers.user_data = jwt.data;
        next();
    }
    catch(e) {
        API_RESPONSE(e, res);  
    }
} 