
import { execute } from './handler';
import { RegisterRequest } from './request';
import { TestReponse, HttpRequest } from '../../core/libs/ApiEvent';

test('422: Parameter Error', async () => {
    const request = {
        identity: {},
        body: <RegisterRequest>{
            username: '',
            password: '',
        },
        params: {

        },
        query: {

        }
    } as HttpRequest


    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(422);
});


test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <RegisterRequest>{
            username: 'liveejohn',
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
