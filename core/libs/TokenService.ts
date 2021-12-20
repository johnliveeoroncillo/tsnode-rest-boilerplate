
import jwt from 'jsonwebtoken';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { CustomResponse, Response401 } from "../defaults";
import { HttpRequest } from '../libs/ApiEvent';

const JWT_TOKEN = process.env?.JWT_TOKEN ?? '';
class TokenService {

    static async generateJWT(data: any): Promise<string> {
        const token = jwt.sign({
            data
        }, JWT_TOKEN, { expiresIn: '1d' });
        return token;
    }

    static async generateRefreshJWT(data: any): Promise<string> {
        const token = jwt.sign({
            data
        }, JWT_TOKEN, { expiresIn: '7d' });
        return token;
    }

    static async verifyToken(token: string): Promise<any> {
        try {
            const reponse:any = jwt.verify(token, JWT_TOKEN, (err: any, decoded: any) => {
                if (decoded === undefined)
                    throw new CustomResponse(Response401, err.message);
                return decoded;
            });
            return reponse;
        }
        catch(e:any) {
            throw new CustomResponse(e, e.message);
        }
    }

    static getUserData(req: HttpRequest): any {
        return req?.identity ?? {};
    }
}

export { TokenService };