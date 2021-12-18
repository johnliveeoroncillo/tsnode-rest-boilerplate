
import * as responses from "../../core/defaults";
import { LoginRequest } from "./request";

export const Validate = (objects: string): LoginRequest => {
    const joi = require("joi");
    const schema = joi.object({
      email: joi.string().required(),
      password: joi.string().required(),
    });
    const dataToValidate = objects;
    const result = schema.validate(dataToValidate, { abortEarly: false });
  
    if (result.error) throw new responses.ParameterError(result);
    return {
      ...result.value,
    };
};