import fse from 'fs-extra';
import { existsSync } from 'fs';
import { pascalCase, snakeCase } from 'case-anything';

const action = `import { Connection } from 'typeorm';
import { <name>Request } from './request';

export class <name>Action {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async execute(request: <name>Request): Promise<void> {}
}
`;

const request = `export interface <name>Request {
    key: string;
}
`;

const handler = `import { API_RESPONSE } from '<dynamic_path>../../../../core';
import { HttpResponse, HttpRequest } from '<dynamic_path>../../../../core/libs/ApiEvent';
import { Response } from 'express';
import { Mysql } from '<dynamic_path>../../../../core/databases/Mysql';
import { Connection } from 'typeorm';

import { Response200 } from './response';
import { Validate } from './validate';
import { <name>Action } from './action';

export async function execute(req: HttpRequest, res: Response): Promise<HttpResponse> {
    try {
        const request = Validate(req.body);
        /**
         * FOR IMAGE 
         * if (req.files?.<name>) request.<name> = req.files.<name>;
         * Object req.files.<name>
         * name: String
         * mv: Void
         * mimetype: String
         * data: StringBuffer
         * tempFilePath: string
         * truncated: Boolean
         * size: Number
         * md5: String
         */
        const connection: Connection = await Mysql.getConnection();
        const action = new <name>Action(connection);
        await action.execute(request);

        return API_RESPONSE(
            {
                ...Response200.SUCCESS,
            },
            res,
        );
    } catch (e) {
        return API_RESPONSE(e, res);
    }
    // finally {
    //     await Mysql.closeConnection();
    // }
}
`;

const handler_test = `import { execute } from './handler';
import { <name>Request } from './request';
import { TestReponse, HttpRequest } from '<dynamic_path>../../../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <<name>Request>{
            key: 'value',
        },
        params: {},
        query: {},
    };

    const result = await execute(request as HttpRequest, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});
`;

const response = `import { HttpResponse } from '<dynamic_path>../../../../core/libs/ApiEvent';

/*
  Your Custom Response */
export class Response200 {
    static SUCCESS: HttpResponse = {
        code: 200,
        message: 'Success',
    };
}

export class NotFound {
    code = 404;
    message = 'Username not found';
}
`;

const validate = `import { <name>Request } from './request';
import { Validation } from '<dynamic_path>../../../../core/libs/Validation';
import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
const joi = JoiImport.extend(DateExtension);
//SAMPLE: joi.date().format('YYYY-MM-DD')

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

const config = `<key_name>: 
  handler: ./src/functions/apis/<name>/handler
  endpoint: /<endpoint>
  method: <method>
  enabled: true

  ##ADD API VERSION
  ##EXAMPLE OUTPUT: /login to /v1/login
  #version: 1

  ##ADD API PREFIX
  ##EXAMPLE: api
  ##EXAMPLE OUTPUT: /login to /api/login
  ##WORKS WITH VERSION SAMPLE OUTPUT: /api/v1/login
  #prefix: api

  ##ADD MIDDLEWARE
  
  ##SINGLE
  ##EXAMPLE: middleware: authorizer
  #middleware: <middleware_name>

  ##MULTIPLE
  ##EXAMPLE: middleware: [authorizer, second_authorizer]
  #middleware: [<middleware_name1>, <middleware_name2>]
`;

export class ApiTemplate {
    private readonly backwards: string;
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
        const length = this.name.split('/').length;
        const backdots: string[] = [];
        if (length > 0) {
            for (let index = 1; index < length; index++) {
                backdots.push('..');
            }
        }
        this.backwards = backdots.join('/') + (backdots?.length > 0 ? '/' : '');
    }

    generate(): void {
        const route = `./src/functions/apis/${this.name}`;
        if (existsSync(route)) throw new Error('API file already existed');

        //ACTION
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/action.ts`,
            action.replace(/<name>/g, pascalCase(this.name)).replace(/<dynamic_path>/g, this.backwards),
        );
        //HANDLER TEST
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/handler_test.ts`,
            handler_test.replace(/<name>/g, pascalCase(this.name)).replace(/<dynamic_path>/g, this.backwards),
        );
        //HANDLER
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/handler.ts`,
            handler.replace(/<name>/g, pascalCase(this.name)).replace(/<dynamic_path>/g, this.backwards),
        );
        //REQUEST
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/request.ts`,
            request.replace(/<name>/g, pascalCase(this.name)).replace(/<dynamic_path>/g, this.backwards),
        );
        //RESPONSE
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/response.ts`,
            response.replace(/<name>/g, pascalCase(this.name)).replace(/<dynamic_path>/g, this.backwards),
        );
        //VALIDATE
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/validate.ts`,
            validate.replace(/<name>/g, pascalCase(this.name)).replace(/<dynamic_path>/g, this.backwards),
        );
        //CONFIG
        fse.outputFileSync(
            `./src/functions/apis/${this.name}/config.yml`,
            config.replace(/<name>/g, this.name).replace(/<key_name>/g, snakeCase(this.name)),
        );
    }
}
