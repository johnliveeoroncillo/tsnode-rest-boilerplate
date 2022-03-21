
import { Connection } from "typeorm";
import { TokenReponse, TokenService } from "../../core/libs/TokenService";
import { UsersRepository } from "../../repository/UsersRepository";
import { LoginRequest } from "./request";
import { NotFound, PasswordError } from "./response";
import { Bcrypt } from '../../core/libs/Bcrypt';
import { USER_SCOPE } from "../../helpers/Enums";

export class LoginAction {
    private userRepository: UsersRepository;

    constructor(connection: Connection) {
        this.userRepository = connection.getCustomRepository(UsersRepository);
    }

    async execute(request: LoginRequest): Promise<TokenReponse> {
        const user = await this.userRepository.getByUsername(request.username, USER_SCOPE.ADMIN);
        if (!user) throw new NotFound();
        
        if (! await Bcrypt.compare(request.password, user.password)) throw new PasswordError();

        const token = await TokenService.adminJWT({
            id: user.id,
            uuid: user.uuid,
        });

        return {
            token,
            data: user,
        }
    }
}