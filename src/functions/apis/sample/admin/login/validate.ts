import { LoginRequest } from './request';
import { Validation } from '../../../../../../core/libs/Validation';
import joi from 'joi';

export const Validate = (request: LoginRequest): LoginRequest => {
    const schema = joi
        .object({
            username: joi.string().required(),
            password: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
