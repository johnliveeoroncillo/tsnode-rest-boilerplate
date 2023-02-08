import { Connection } from 'typeorm';
import { Unauthorized } from '../../../../../../core/defaults';
import { UsersRepository } from '../../../../../repository/UsersRepository';

interface User {
    id: number;
    uuid: string;
    username: string;
    created_at: string;
    scope: string;
}
export class ProfileReadAction {
    private userRepository: UsersRepository;

    constructor(connection: Connection) {
        this.userRepository = connection.getCustomRepository(UsersRepository);
    }

    async execute(id: string | number, uuid: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ id: Number(id), uuid });
        if (!user) throw new Unauthorized();

        return {
            id: user.id,
            uuid: user.uuid,
            username: user.username,
            scope: user.scope,
            created_at: user.created_at,
        };
    }
}
