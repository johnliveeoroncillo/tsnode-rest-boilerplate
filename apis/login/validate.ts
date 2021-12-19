
import * as responses from "../../core/defaults";
import { LoginRequest } from "./request";
import { Validation } from "../../core/libs/Validation";
import { Request } from "express";

export const Validate = (request: LoginRequest): LoginRequest => {
    const joi = require("joi");
    const schema = joi
        .object({
            email: joi.string().required(),
            password: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};