import { RedisInsertRequest } from './request';
import { Validation } from '../../../../../core/libs/Validation';
import joi from 'joi';

export const Validate = (request: RedisInsertRequest): RedisInsertRequest => {
    const schema = joi
        .object({
            key: joi.string().required(),
            value: joi.any().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
