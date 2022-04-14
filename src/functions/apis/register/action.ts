import { Connection } from 'typeorm';
import { UsersRepository } from '../../../repository/UsersRepository';
import { RegisterRequest } from './request';
import { UsersModel } from '../../../models/UsersModel';
import { Duplicate, ScopeNotFound } from './response';
import { Bcrypt } from '../../../../core/libs/Bcrypt';
import { USER_SCOPE } from '../../../helpers/Enums';

export class RegisterAction {
    private userRepository: UsersRepository;

    constructor(connection: Connection) {
        this.userRepository = connection.getCustomRepository(UsersRepository);
    }

    async execute(request: RegisterRequest): Promise<UsersModel> {
        if (!USER_SCOPE?.[request.scope as USER_SCOPE]) throw new ScopeNotFound();

        const user = await this.userRepository.getByUsername(request.username, request.scope as USER_SCOPE);
        if (user) throw new Duplicate();

        const model = new UsersModel();
        model.username = request.username;
        model.password = await Bcrypt.encrypt(request.password);
        model.scope = request.scope;
        await this.userRepository.insert(model);

        return model;
    }
}
