import { EntityRepository, Repository } from "typeorm";
import { UsersModel } from "../models/UsersModel";
@EntityRepository(UsersModel)
export class UsersRepository extends Repository<UsersModel> {
    async getAll(): Promise<UsersModel[]> {
        const sql = this.createQueryBuilder('a');
        return sql.getMany();
    }

    async getByUsername(username: string): Promise<UsersModel | undefined> {
        const data = this.createQueryBuilder('a')
                        .where('username = :username', { username })
                        .getOne();
        
        return data;
    }
}