import fse from 'fs-extra';
import { existsSync } from 'fs';

const content = `@startuml

User ->  API: Enter username and Password

group Validation
    API -> Database: Check username and password

    alt Success
        Database -> API: Username and password is correct
        API -> User: Return access token
    end
    alt Error
        Database -> API: Username or password is incorrect
        API -> User: Return error message
    end
end

@enduml
`;

const apidoc = `import { ApiBody, ApiConfig, ApiResponse, TYPES, ApiHeader } from '../../core/libs/DocsBuilder';
import * as faker from 'faker';

const config: ApiConfig = {
    path: '/<url>/{user_id}',
    method: <method>,
    title: '',
    description: '',
    group: '',
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
`;
export class DocsTemplate {
    private readonly name: string;

    constructor(name: string) {
        this.name = name.trim();
    }

    generate(): void {
        if (!existsSync(`./docs/${this.name}/${this.name}.puml`))
            fse.outputFileSync(`./docs/${this.name}/${this.name}.puml`, content);
        if (!existsSync(`./docs/${this.name}/doc.ts`)) fse.outputFileSync(`./docs/${this.name}/doc.ts`, apidoc);
    }
}
