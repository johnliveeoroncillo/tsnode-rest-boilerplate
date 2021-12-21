import { Database } from "../core/database";
import { UsersModel } from "../models/UsersModel";
import { UsersRepository } from "../repository/UsersRepository";

export class UserSeeder {

    async seedUser(data: unknown): Promise<UsersModel> {
        const connection = await Database.getConnection();
        const userRepository = await connection.getCustomRepository(UsersRepository);

        const user = Object.assign(new UsersModel(), data);
        await userRepository.create(user);

        return user;
    }

}