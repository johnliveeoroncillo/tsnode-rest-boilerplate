import { RegisterRequest } from './request';
import { Validation } from '../../core/libs/Validation';
import joi from 'joi';

export const Validate = (request: RegisterRequest): RegisterRequest => {
    const schema = joi
        .object({
            username: joi.string().min(1).required(),
            password: joi.string().min(1).required(),
            scope: joi.string().max(6).required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
