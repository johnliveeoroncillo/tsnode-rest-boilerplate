import { execute } from './handler';
import { SendEmailRequest } from './request';
import { TestReponse, HttpRequest } from '../../../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <SendEmailRequest>{
            to: 'johnliveeoroncillo@gmail.com',
            message: 'Test',
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});
