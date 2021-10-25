
import express, { response } from "express";
import { generateRoute, API_RESPONSE } from "../../core/core";
import { Request, Response, NextFunction } from "express";
import * as responses from "../../core/defaults";
import { Connection } from "typeorm";
import { Database } from "../../core/database";
import { UserRepository } from "../../repository/UserRepository";
import { comparePassword } from "../../core/utils";
import { TokenService } from '../../services/TokenService';

const router = express.Router();
const path = generateRoute(__filename);
const database = new Database();
interface ApiRequest {
  eadd: string;
  upass: string;
}

const Validate = (objects: string): ApiRequest => {
  const joi = require("joi");
  const schema = joi.object({ 
    eadd: joi.string().required(), 
    upass: joi.string().required(), 
  }); 
  const dataToValidate = objects;

  const result = schema.validate(dataToValidate, { abortEarly: false });

  if (result.error) throw new responses.ParameterError(result);
  return {
    ...result.value,
  };
};

const postAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = Validate(req.body);
    const connection: Connection = await database.getConnection();
    const userRepository: UserRepository = connection.getCustomRepository(UserRepository);

    const user:any = await userRepository.loginByEmailOrPassword(request.eadd, request.eadd);
    if(!user) throw new responses.CustomResponse(responses.Response400, 'User not found');
    if(!await comparePassword(request.upass, user.upass)) throw new responses.CustomResponse(responses.Response400, 'Invalid email address or password');
    
    delete user.upass;

    const token = await TokenService.generateJWT(user);
    const refresh_token = await TokenService.generateRefreshJWT(user);
    
    API_RESPONSE({
      ...responses.Response200,
      token,
      refresh_token,
      user
    }, res);
  } 
  catch(e: any) {
    API_RESPONSE(e, res);
  }
};


router.post(path, postAction);
export = router;
