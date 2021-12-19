
const jwt = require('jsonwebtoken');
require('dotenv').config();
import { Request } from "express";
import { CustomResponse, Response401 } from "../defaults";

class TokenService {
    static async generateJWT(data: object): Promise<string> {
        const token = await jwt.sign({
            data
        }, process.env.JWT_TOKEN, { expiresIn: '1d' });
        return token;
    }

    static async generateRefreshJWT(data: object): Promise<string> {
        const token = await jwt.sign({
            data
        }, process.env.JWT_TOKEN, { expiresIn: '7d' });
        return token;
    }

    static async verifyToken(token: string): Promise<object> {
        try {
            const reponse:any = await jwt.verify(token, process.env.JWT_TOKEN, (err:any, decoded:any) => {
                if(decoded === undefined) throw new CustomResponse(Response401, err.message);
                return decoded;
            });
            return reponse;
        }
        catch(e:any) {
            throw new CustomResponse(e, e.message);
        }
    }

    static getUserData(req: Request): any {
        return req?.identity ?? {};
    }
}

export { TokenService };