
import { RegisterRequest } from "./request";
import { Validation } from "../../core/libs/Validation";
import joi from 'joi';

export const Validate = (request: RegisterRequest): RegisterRequest => {
    const schema = joi
        .object({
            key: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
