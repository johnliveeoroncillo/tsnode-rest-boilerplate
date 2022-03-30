import { Mysql } from '../core/databases/Mysql';
import { UsersModel } from '../src/models/UsersModel';
import { UsersRepository } from '../src/repository/UsersRepository';
import { Bcrypt } from '../core/libs/Bcrypt';
import process from 'process';

export class UserSeeder {
    static async seedUser(): Promise<void> {
        const promises: Promise<UsersModel>[] = [];
        for (let i = 1; i <= 10; i++) {
            promises.push(this.create(i));
        }

        await Promise.all(promises).then(() => {
            console.log('Successfully seed');
            process.exit();
        });
    }

    static async create(index: number): Promise<UsersModel> {
        const connection = await Mysql.getConnection();
        const userRepository = connection.getCustomRepository(UsersRepository);
        const user = new UsersModel();
        user.username = `test${index}`;
        user.password = await Bcrypt.encrypt('test');
        await userRepository.insert(user);
        return user;
    }
}
