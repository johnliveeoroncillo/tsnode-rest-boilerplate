import { EventRequest } from './request';
import { Validation } from '../../../../core/libs/Validation';
import joi from 'joi';

export const Validate = (request: EventRequest): EventRequest => {
    const schema = joi
        .object({
            message: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
