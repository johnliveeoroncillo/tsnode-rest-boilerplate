
import { Connection } from "typeorm";
import { RegisterRequest } from "./request";

export class RegisterAction {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: RegisterRequest): Promise<void> {}
}