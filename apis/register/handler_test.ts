
import { execute } from './handler';
import { RegisterRequest } from './request';
import { Request } from "express";
import { TestReponse, nextFunction } from '../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <RegisterRequest>{
            email: 'John',
            password: 'test',
        },
        params: {

        },
        query: {

        }
    } as Request


    const result = await execute(request, TestReponse, nextFunction);
    const response = result.body;

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
