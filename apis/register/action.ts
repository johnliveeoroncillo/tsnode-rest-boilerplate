
import { Connection } from "typeorm";
import { UsersRepository } from "../../repository/UsersRepository";
import { RegisterRequest } from "./request";
import { UsersModel } from "../../models/UsersModel";
import { Duplicate } from "./response";
import { cryptPassword } from "../../core/utils";

export class RegisterAction {
    private connection: Connection;
    private userRepository: UsersRepository;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: RegisterRequest): Promise<UsersModel> {
        const user = await this.userRepository.getByUsername(request.username);
        if (user) throw new Duplicate();

        const model = new UsersModel();
        model.username = request.username;
        model.password = await cryptPassword(request.password);
        const data = await this.userRepository.create(model);

        return data;
    }
}