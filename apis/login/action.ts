import { Connection } from "typeorm";
import { LoginRequest } from "./request";
import { TokenService } from '../../core/libs/TokenService'

export class LoginAction {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: LoginRequest): Promise<{token: string;}> {
        const token = await TokenService.generateJWT(request);
        return {token};
    }
}