import { ApiBody, ApiConfig, ApiResponse, TYPES, ApiHeader } from '../../core/libs/DocsBuilder';
import * as faker from 'faker';
import { METHODS } from '../../core/libs/ApiEvent';

const config: ApiConfig = {
    path: '/profile',
    method: METHODS.get,
    title: 'Profile',
    description: 'Profile',
    group: 'User',
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
                        Authorization: 'Bearer ey' + faker.random.alphaNumeric(50),
                    },
                },
            ],
        },
    ],
};

const body: ApiBody[] = [];

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
                name: '401 Unauthorized Access',
                example: {
                    code: 401,
                    message: 'Unauthorized Access',
                },
            },
        ],
    },
};

export { config, header, body, response };
