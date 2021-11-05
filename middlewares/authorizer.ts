import { Response, Request, NextFunction } from "express";
import { API_RESPONSE } from "../core/core";
import { Response500, MissingAuthToken } from '../core/defaults';
import { TokenService } from "../core/libs/TokenService";
import fs from 'fs';



export async function authorizer(req: Request, res: Response, next:NextFunction):Promise<void> {
    if(!checkAuthorizers(req, res)) return next();

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

function checkAuthorizers(req: Request, res: Response): boolean {
    try {
        const path = req.path;
        let rawdata:any = fs.readFileSync('./authorizer.json');
        let paths = JSON.parse(rawdata);
        const find = paths.findIndex((el:string) => el == path);
        return find >= 0;
    }
    catch(e: any) {
        Response500.message = e.message.toString();
        API_RESPONSE(Response500, res);
        return true;
    }
}
 