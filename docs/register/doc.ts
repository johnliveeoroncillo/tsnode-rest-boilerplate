import { ApiBody, ApiConfig, ApiResponse, TYPES, ApiHeader } from '../../core/libs/DocsBuilder';
import * as faker from 'faker';
import { METHODS } from '../../core/libs/ApiEvent';

const config: ApiConfig = {
    path: '/register',
    method: METHODS.post,
    title: 'Register',
    description: 'Register',
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
    {
        name: 'scope',
        type: TYPES.STRING,
        description: 'User Scope',
        required: true,
        allowedValues: ['ADMIN', 'CLIENT'],
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
                        scope: 'Scope is required',
                    },
                },
            },
            {
                name: '409 Username already exists',
                example: {
                    code: 409,
                    message: 'Username already exists',
                },
            },
        ],
    },
};

export { config, header, body, response };
