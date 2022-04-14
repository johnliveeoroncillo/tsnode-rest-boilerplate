/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { CustomResponse, Response401 } from '../defaults';
import { HttpRequest, Identity } from '../libs/ApiEvent';
import { env } from './Env';

const JWT_TOKEN = env('JWT_TOKEN', '');
const JWT_ADMIN_TOKEN = env('JWT_ADMIN_TOKEN', '');
export interface TokenReponse {
    token: string;
    data: Identity;
}

export class TokenService {
    static async clientJWT(data: Identity): Promise<string> {
        return await this.generateJWT(data, JWT_TOKEN);
    }

    static async adminJWT(data: Identity): Promise<string> {
        return await this.generateJWT(data, JWT_ADMIN_TOKEN);
    }

    private static async generateJWT(data: Identity, TOKEN: string): Promise<string> {
        const token = jwt.sign(
            {
                data,
            },
            TOKEN,
            { expiresIn: '1d' },
        );
        return token;
    }

    static async verifyClientToken(token: string): Promise<any> {
        return this.verifyToken(token, JWT_TOKEN);
    }

    static async verifyAdminToken(token: string): Promise<any> {
        return this.verifyToken(token, JWT_ADMIN_TOKEN);
    }

    private static async verifyToken(token: string, SECRET: string): Promise<any> {
        try {
            const response = jwt.verify(token, SECRET, (err, decoded) => {
                if (decoded === undefined) throw new CustomResponse(Response401, err?.message);
                return decoded;
            });
            return response;
        } catch (e: any) {
            throw new CustomResponse(e, e.message);
        }
    }

    static getUserData(req: HttpRequest): unknown {
        return req?.identity ?? {};
    }
}
