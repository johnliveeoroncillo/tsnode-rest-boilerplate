import { execute } from './handler';
import { TestReponse, HttpRequest } from '../../../../core/libs/ApiEvent';
import * as faker from 'faker';
import { UserSeeder } from '../../../../seeder/UserSeeder';

test('401: UNAUTHORIZED', async () => {
    const request = {
        identity: {
            id: 0,
            uuid: faker.datatype.uuid(),
        },
    } as HttpRequest;

    const result = await execute(request, TestReponse);
    console.log(result);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(401);
});

test('200: SUCCESS', async () => {
    const user = await UserSeeder.create(1);
    const request = {
        identity: {
            id: user.id,
            uuid: user.uuid,
        },
    } as HttpRequest;

    const result = await execute(request, TestReponse);
    console.log(result);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});
