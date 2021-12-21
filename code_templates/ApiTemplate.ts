import fse from "fs-extra";
import { existsSync } from "fs";
import { pascalCase } from "case-anything";


const action = `
import { Connection } from "typeorm";
import { <name>Request } from "./request";

export class <name>Action {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: <name>Request): Promise<void> {}
}`;

const request = `
export interface <name>Request {
    key: string;
}`;

const handler = `
import { API_RESPONSE } from "../../core";
import { HttpResponse } from "../../core/libs/ApiEvent";
import { Request, Response, NextFunction } from "express";
import { Database } from "../../core/database";
import { Connection } from "typeorm";

import { Response200 } from "./response";
import { Validate } from "./validate";
import { <name>Action } from "./action";

export async function execute(req: Request, res: Response): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);
        const connection: Connection = await Database.getConnection();  
        const action = new <name>Action(connection);
        await action.execute(request);
        
        return API_RESPONSE({
            ...Response200.SUCCESS,
        }, res);
    }
    catch(e) {
        return API_RESPONSE(e, res);
    }
    finally {
        await Database.closeConnection();
    }
}
`;

const handler_test = `
import { execute } from './handler';
import { <name>Request } from './request';
import { TestReponse, HttpRequest } from '../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <<name>Request>{
            email: 'John',
            password: 'test',
        },
        params: {

        },
        query: {

        }
    } as HttpRequest


    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});
`;

const response = `
/*
    Your Custom Response */

  export class Response200 {
      static SUCCESS: HttpResponse = {
          code: 200,
          message: 'Success',
      }
  }

  export class Duplicate {
      code = 409;
      message = 'Username already exists';
  }
`;

const validate = `
import { <name>Request } from "./request";
import { Validation } from "../../core/libs/Validation";
import joi from 'joi';

export const Validate = (request: <name>Request): <name>Request => {
    const schema = joi
        .object({
            key: joi.string().required(),
        })
        .required();

    const validate = new Validation(schema);
    return validate.validate(request);
};
`;

const config = `
<name>: 
  handler: ./apis/<name>/handler
  endpoint: /<name>
  method: <method>
  #UNCOMMENT TO ATTACH MIDDLEWARE
  #EXAMPLE: middleware: middleware
  #middleware: <middleware_name>
`;

export class ApiTemplate {
  private readonly filename: string;
  private readonly name: string;

  constructor(name: string) {
    this.name = name.trim(); //pluralize(name.trim())
    this.filename = `${this.name}.ts`;
  }

  generate(): void {
    const route = `./apis/${this.name}/${this.filename}`
    if (existsSync(route))
      throw new Error("API file already existed");

    //ACTION
    fse.outputFileSync(
      `./apis/${this.name}/action.ts`, action.replace(/<name>/g, 
      pascalCase(this.name))
    );
    //HANDLER TEST
    fse.outputFileSync(
      `./apis/${this.name}/handler_test.ts`,
      handler_test.replace(/<name>/g, pascalCase(this.name))
    );
    //HANDLER
    fse.outputFileSync(
      `./apis/${this.name}/handler.ts`,
      handler.replace(/<name>/g, pascalCase(this.name))
    );
    //REQUEST
    fse.outputFileSync(
      `./apis/${this.name}/request.ts`,
      request.replace(/<name>/g, pascalCase(this.name))
    );
    //RESPONSE
    fse.outputFileSync(
      `./apis/${this.name}/response.ts`,
      response.replace(/<name>/g, pascalCase(this.name))
    );
    //VALIDATE
    fse.outputFileSync(
      `./apis/${this.name}/validate.ts`,
      validate.replace(/<name>/g, pascalCase(this.name))
    );
    //CONFIG
    fse.outputFileSync(
      `./apis/${this.name}/config.yml`,
      config.replace(/<name>/g, this.name)
    );
  }
}
