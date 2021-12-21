
import { Connection } from "typeorm";
import { TokenService } from "../../core/libs/TokenService";
import { comparePassword } from "../../core/utils";
import { UsersModel } from "../../models/UsersModel";
import { UsersRepository } from "../../repository/UsersRepository";
import { LoginRequest } from "./request";
import { NotFound, PasswordError } from "./response";

interface UserReponse {
    token: string;
    data: UsersModel;
}

export class LoginAction {
    private userRepository: UsersRepository;

    constructor(connection: Connection) {
        this.userRepository = connection.getCustomRepository(UsersRepository);
    }

    async execute(request: LoginRequest): Promise<UserReponse> {
        const user = await this.userRepository.getByUsername(request.username);
        if (!user) throw new NotFound();
        
        if (! await comparePassword(request.password, user.password)) throw new PasswordError();

        const token = await TokenService.generateJWT(user);
        return {
            token,
            data: user,
        }
    }
}