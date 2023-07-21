import { SocketioTestRequest } from './request';
import { Validation } from '../../../../../core/libs/Validation';
import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
const joi = JoiImport.extend(DateExtension);
//SAMPLE: joi.date().format('YYYY-MM-DD')

export const Validate = (request: SocketioTestRequest): SocketioTestRequest => {
    const schema = joi
        .object({
            message: joi.string().required(),
            socket_id: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
