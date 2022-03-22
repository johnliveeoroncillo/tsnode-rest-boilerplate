## THIS IS A SAMPLE DOC FOR REFERENCE ##

import { ApiBody, ApiConfig, ApiResponse, TYPES, ApiHeader } from '../core/libs/DocsBuilder';
import * as faker from 'faker';

const config: ApiConfig = {
    path: '/login/{user_id}',
    method: 'post',
    title: 'Login',
    description: 'Api for authentication',
    group: 'Authentication',
};

const header: ApiHeader = {
    headers: [
        {
            name: 'Authorization',
            type: TYPES.STRING,
            description: 'Authorization token',
            required: true,
            examples: [
                {
                    name: 'Authorization',
                    example: {
                        Authorization: 'Bearer ' + faker.random.alphaNumeric(20),
                    },
                },
            ],
        },
    ],
    parameters: [
        {
            name: 'user_id',
            type: TYPES.STRING,
            description: 'Parameter for User ID',
        },
    ],
    query: [
        {
            name: 'user_id',
            type: TYPES.STRING,
            description: 'Parameter for User ID',
        },
    ],
};

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
        allowedValues: ['test1', 'test2'],
    },
    {
        name: 'nested',
        type: TYPES.OBJECT,
        description: 'Nested objects',
        items: [
            {
                name: 'test1',
                type: TYPES.OBJECT,
                description: 'Nested1',
                items: [
                    {
                        name: 'test1-1',
                        type: TYPES.OBJECT,
                        description: 'Nested1-1',
                        items: [
                            {
                                name: 'test1-2',
                                type: TYPES.STRING,
                                description: 'Nested1-2',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'test2',
                type: TYPES.STRING,
                description: 'Nested2',
            },
        ],
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
                    },
                },
            },
        ],
    },
};

export { config, header, body, response };
