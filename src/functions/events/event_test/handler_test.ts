import { execute } from './handler';
import { EventTestRequest } from './request';

test('200: SUCCESS', async () => {
    const request: EventTestRequest = {
        message: 'test',
    };

    const result = await execute(request);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(200);
});
