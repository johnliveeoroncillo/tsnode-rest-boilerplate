import { Connection } from "typeorm";
import { LoginRequest } from "./request";

export class LoginAction {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: LoginRequest): Promise<void> {
        
    }
}