import { EventTestRequest } from "./request";
import { Validation } from "../../core/libs/Validation";
import joi from 'joi';

export const Validate = (request: EventTestRequest): EventTestRequest => {
    const schema = joi
        .object({
            message: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
