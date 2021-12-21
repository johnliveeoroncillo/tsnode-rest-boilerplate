
import { execute } from './handler';
import { TestReponse, HttpRequest } from '../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {
            id: 1,
        },
    } as unknown as HttpRequest


    const result = await execute(request, TestReponse);
    console.log(result);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});
