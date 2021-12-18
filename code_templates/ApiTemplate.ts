import { writeFileSync, existsSync } from "fs";
import fse from "fs-extra";
import { snakeCase } from "case-anything";
import pluralize from "pluralize";
import { timestamp } from "../core/utils";


let content = `
import express from "express";
import { generateRoute, API_RESPONSE } from "<dynamic_route>/core";
import { Request, Response, NextFunction } from "express";
import * as responses from "<dynamic_route>/core/defaults";
import { Database } from "<dynamic_route>/core/database";
import { Connection } from "typeorm";

const router = express.Router();
const path = generateRoute(__filename);
const database = new Database();

interface ApiRequest {
  email: string;
  password: string;
}

const Validate = (objects: string): ApiRequest => {
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

const postAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = Validate(req.body);
    const connection: Connection = await database.getConnection();

    /*DO ACTIONS HERE*/
    API_RESPONSE(responses.Response200, res);
  } 
  catch(e: any) {
    API_RESPONSE(e, res);
  }
};


const getAction = async (req: Request, res: Response) => {
  try {
    const connection: Connection = await database.getConnection();
    
    /*DO ACTIONS HERE*/
    API_RESPONSE(responses.Response200, res);
  } catch (e) {
    API_RESPONSE(e, res);
  }
};


router.post(path, postAction);
router.get(path, getAction);
// router.delete(path, <function>);
// router.put(path, <function>);
export = router;
`;

export class ApiTemplate {
  private readonly filename: string;
  private readonly name: string;

  constructor(name: string) {
    // Check for blank filename change it into index
    const splitName = name.split('/');
    if(splitName[splitName.length - 1] == '') splitName[splitName.length - 1] = 'index';
    name = splitName.join('/');

    this.name = name.trim(); //pluralize(name.trim())
    this.filename = `${this.name}.ts`;
  }

  generate(): void {
    const route = `./apis/${this.filename}`
    if (existsSync(route))
      throw new Error("API file already existed");

    // Create dynamic route for imports
    let dynamic_route:any = route.substr(2).split('/');
    dynamic_route.pop();
    const route_length = dynamic_route.length;
    dynamic_route = [];
    for(let i = 0; i < route_length; i++) {
        dynamic_route.push('..')
    }

    dynamic_route = dynamic_route.join('/');
    content = content.replace(/<dynamic_route>/g, dynamic_route);
    fse.outputFileSync(`${route.replace(/:/g, '_')}`, content);
  }
}
