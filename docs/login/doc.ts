import { ApiBody, ApiConfig, ApiResponse, TYPES, ApiHeader } from '../../core/libs/DocsBuilder';
import * as faker from 'faker';
import { METHODS } from '../../core/libs/ApiEvent';

const config: ApiConfig = {
    path: '/login',
    method: METHODS.post,
    title: 'Login',
    description: 'Login',
    group: 'Authentication',
};

const header: ApiHeader = {};

const body: ApiBody[] = [
    {
        name: 'username',
        type: TYPES.STRING,
        description: 'Username of the user',
        required: true,
    },
    {
        name: 'password',
        type: TYPES.STRING,
        description: 'Password of the user',
        required: true,
    },
];

const response: ApiResponse = {
    success: {
        details: [
            {
                name: 'code',
                type: TYPES.NUMBER,
                description: 'Status code',
            },
            {
                name: 'message',
                type: TYPES.STRING,
                description: 'Status message',
            },
            {
                name: 'data',
                type: TYPES.JSON,
                description: 'JSON Data (optional)',
            },
        ],
        examples: [
            {
                name: 'Success',
                example: {
                    code: 200,
                    message: 'Success',
                    access_token: faker.random.alphaNumeric(25),
                    data: {
                        id: faker.datatype.number({ min: 1, max: 10 }),
                        uuid: faker.datatype.uuid(),
                        username: faker.internet.userName(),
                        created_at: faker.datatype.datetime(),
                        updated_at: faker.datatype.datetime(),
                        deleted_at: null,
                    },
                },
            },
        ],
    },
    error: {
        details: [
            {
                name: 'code',
                type: TYPES.NUMBER,
                description: 'Status code',
            },
            {
                name: 'message',
                type: TYPES.STRING,
                description: 'Status message',
            },
            {
                name: 'errors',
                type: TYPES.JSON,
                description: 'Parameter Errors',
            },
        ],
        examples: [
            {
                name: '422 Parameter Error',
                example: {
                    code: 422,
                    message: 'Parameter Error',
                    errors: {
                        username: 'Username is required',
                        password: 'Password is required',
                    },
                },
            },
            {
                name: '404 Username not found',
                example: {
                    code: 404,
                    message: 'Username not found',
                },
            },
            {
                name: '404 Invalid username or password',
                example: {
                    code: 400,
                    message: 'Invalid username or password',
                },
            },
        ],
    },
};

export { config, header, body, response };
