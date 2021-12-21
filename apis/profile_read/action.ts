import { Connection } from "typeorm";
import { UsersModel } from "../../models/UsersModel";
import { UsersRepository } from "../../repository/UsersRepository";

export class ProfileReadAction {
    private userRepository: UsersRepository;

    constructor(connection: Connection) {
        this.userRepository = connection.getCustomRepository(UsersRepository);
    }

    async execute(id: number): Promise<UsersModel | undefined> {
        return await this.userRepository.findOne(id);
    }
}