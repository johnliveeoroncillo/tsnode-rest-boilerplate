import glob from 'glob';
import fse from 'fs-extra';
import path from 'path';
import { Logger } from './Logger';
const current_version = '0.1.0';

interface Data {
    config: ApiConfig;
    body: ApiBody[];
    header: ApiHeader;
    response: ApiResponse;
}

export interface ApiConfig {
    path: string;
    method: string;
    version?: string;
    group: string;
    title: string;
    description: string;
}

export interface ApiBody {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    default?: string;
    items?: ApiBody[];
    allowedValues?: any[];
}

export interface ApiHeader {
    query?: ApiHeadersContent[];
    parameters?: ApiHeadersContent[];
    headers?: ApiHeadersContent[];
}

export interface ApiResponse {
    success: ApiResponseContent;
    error: ApiResponseContent;
}

interface ApiHeadersContent extends ApiBody {
    examples?: ApiResponseExampleContent[];
}

interface ApiResponseContent {
    details: ApiBody[];
    examples: ApiResponseExampleContent[];
}

interface ApiResponseExampleContent {
    name: string;
    example: any;
}

export enum TYPES {
    STRING = 'String',
    ARRAY_STRING = 'String[]',
    BOOLEAN = 'Boolean',
    NUMBER = 'Number',
    ARRAY_NUMBER = 'Number[]',
    JSON = 'JSON',
    ARRAY = 'Array',
    OBJECT = 'Object',
    ARRAY_OBJECT = 'Object[]',
}

enum API_TYPE {
    BODY = 'apiBody',
    PARAMS = 'apiParam',
    QUERY = 'apiQuery',
    HEADER = 'apiHeader',
}

export class DocsBuilder {
    static build(data: Data) {
        const { config, body, response, header } = data;
        if (!data.config.version) data.config.version = current_version;

        let text = `/**\n`;

        text += ` * @api {${config.method}} ${config.path.replace(/{/g, ':').replace(/}/g, '')} ${
            config.description
        }\n`;
        text += ` * @apiVersion ${config.version}\n`;
        text += ` * @apiName ${config.title}\n`;
        text += ` * @apiGroup ${config.group}\n`;

        if (header.headers) {
            header.headers.forEach((element: ApiHeadersContent) => {
                text += DocsBuilder.generateLine(element, API_TYPE.HEADER);
            });
        }

        if (header.parameters) {
            header.parameters.forEach((element: ApiHeadersContent) => {
                text += DocsBuilder.generateLine(element, API_TYPE.PARAMS);
            });
        }

        if (header.query) {
            header.query.forEach((element: ApiHeadersContent) => {
                text += DocsBuilder.generateLine(element, API_TYPE.QUERY);
            });
        }

        body.forEach((element: ApiBody) => {
            if (element.type === TYPES.OBJECT && element.items?.length) {
                const texts = DocsBuilder.initializeItems(element, element.name);
                if (texts.length) {
                    texts.forEach((item: ApiBody) => {
                        text += DocsBuilder.generateLine(item, API_TYPE.BODY);
                    });
                }
            } else text += DocsBuilder.generateLine(element, API_TYPE.BODY);
        });

        Object.entries(response).forEach(([key, value]): void => {
            const { details, examples } = value;
            const isSuccess = key === 'success';
            details.forEach((element: ApiBody) => {
                text += ` * @api${isSuccess ? 'Success' : 'Error'} (${isSuccess ? 'Success' : 'Error'}) {${
                    element.type
                }} ${element.name} ${element.description}\n`;
            });

            examples.forEach((element: ApiResponseExampleContent) => {
                text += ` * @api${isSuccess ? 'Success' : 'Error'}Example {json} ${element.name} \n
                * ${JSON.stringify(element.example)}\n`;
            });
        });

        text += ' */';
        return text;
    }

    private static generateLine(element: ApiHeadersContent, type: API_TYPE): string {
        let text = '';
        let name = '';
        let body_content = ` * @${type} {<type><allowed_values>} <name> <description>\n`;

        const examples = element?.examples ?? [];
        for (let i = 0; i < examples.length; i++) {
            const example = examples[i];
            text += ` * @${type}Example {json} ${example.name}:\n
            * ${JSON.stringify(example.example)}\n`;
        }

        if (element.required) name = element.name;
        else name = `[${element.name}]`;

        body_content = body_content.replace(/<type>/g, element.type);

        if (element?.allowedValues?.length)
            body_content = body_content.replace(/<allowed_values>/g, `="${element.allowedValues.join('","')}"`);
        else body_content = body_content.replace(/<allowed_values>/g, '');

        text += body_content.replace(/<name>/g, name).replace(/<description>/g, element.description);
        return text;
    }

    private static initializeItems(element: ApiBody, last_key = '') {
        const text = [];
        const items = element.items;
        text.push({
            name: last_key,
            description: element.description,
            type: element.type,
            required: element?.required ?? false,
            allowedValues: element.allowedValues,
        });
        if (items?.length)
            items.forEach((item: ApiBody) => {
                if (item.type === TYPES.OBJECT && item?.items?.length) {
                    text.push(...DocsBuilder.initializeItems(item, `${last_key}.${item.name}`));
                } else {
                    text.push({
                        name: `${last_key}.${item.name}`,
                        description: item.description,
                        type: item.type,
                        required: element?.required ?? false,
                        allowedValues: element.allowedValues,
                    });
                }
            });
        return text;
    }
}

export const generate = () => {
    glob('**/docs/**/doc.ts', (er: any, files: any) => {
        if (files?.length) {
            files.forEach(async (file: string) => {
                const data = await require(`../../${file}`);
                const docs = DocsBuilder.build(data);
                const location = path.dirname(file);
                fse.outputFileSync(`./${location}/temp.ts`, docs);
            });
        }
    });
};

export const deleteDocs = () => {
    glob('**/docs/**/temp.ts', (er: any, files: any) => {
        if (files?.length) {
            files.forEach(async (file: string) => {
                fse.unlinkSync(file);
            });
        }
    });
};
