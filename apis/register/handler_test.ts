
import { execute } from './handler';
import { RegisterRequest } from './request';
import { TestReponse, HttpRequest } from '../../core/libs/ApiEvent';

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
    const response = result.body;

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
