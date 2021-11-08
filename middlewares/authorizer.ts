import { Response, Request, NextFunction } from "express";
import { API_RESPONSE } from "../core/core";
import { Response500, MissingAuthToken } from '../core/defaults';
import { TokenService } from "../services/TokenService";
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
        console.log(path);
        let rawdata:any = fs.readFileSync('./authorizer.json');
        let paths = JSON.parse(rawdata);
        const find = paths.find((el:string) => {
            const indeces = getIndices(el.split('/'))
            const path_split = path.split('/');
            
            if(!indeces.length && el == path) return el;
            else if(indeces.length) {
                let count: number = 0;
                indeces.forEach((element: number) => {
                    if(path_split?.[element] && path_split?.[element] != '') count++;
                });
                return count == indeces.length;
            }
        });
        return find;
    }
    catch(e: any) {
        Response500.message = e.message.toString();
        API_RESPONSE(Response500, res);
        return true;
    }
}

function getIndices(array: any): any {
    let indices: any = [];
    for(let i = 0; i < array.length; i++) {
        const path = array[i];
        if(path.includes(':')) indices.push(i);
    }

    return indices;
}