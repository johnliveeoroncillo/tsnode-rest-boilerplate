import { EntityRepository, Repository } from 'typeorm';
import { USER_SCOPE } from '../helpers/Enums';
import { UsersModel } from '../models/UsersModel';
@EntityRepository(UsersModel)
export class UsersRepository extends Repository<UsersModel> {
    async getAll(): Promise<UsersModel[]> {
        const sql = this.createQueryBuilder('a');
        return sql.getMany();
    }

    async getByUsername(username: string, scope: USER_SCOPE): Promise<UsersModel | undefined> {
        const data = this.createQueryBuilder('a')
            .where('username = :username', { username })
            .andWhere('scope = :scope', { scope })
            .getOne();

        return data;
    }
}
