import { execute } from './handler';
import { SocketioTestRequest } from './request';
import { TestReponse, HttpRequest } from '../../../../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <SocketioTestRequest>{
            socket_id: 'value',
            message: 'test message',
        },
        params: {},
        query: {},
    };

    const result = await execute(request as HttpRequest, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result.code).toBe(200);
});
