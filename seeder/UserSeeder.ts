import { Database } from "../core/database";
import { UsersModel } from "../models/UsersModel";
import { UsersRepository } from "../repository/UsersRepository";

export class UserSeeder {

    static async seedUser(data: any): Promise<UsersModel> {
        const connection = await Database.getConnection();
        const userRepository = await connection.getCustomRepository(UsersRepository);

        const user = new UsersModel();
        user.username = data.username;
        user.password = data.password;
        userRepository.insert(user);

        return user;
    }

}