import { SendEmailRequest } from './request';
import { Validation } from '../../../../../core/libs/Validation';
import joi from 'joi';

export const Validate = (request: SendEmailRequest): SendEmailRequest => {
    const schema = joi
        .object({
            to: joi.string().required(),
            message: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
