import { execute } from './handler';
import { RegisterRequest } from './request';
import { TestReponse, HttpRequest } from '../../../../../../core/libs/ApiEvent';
import { UserSeeder } from '../../../../../../seeder/UserSeeder';
import * as faker from 'faker';
import { Bcrypt } from '../../../../../../core/libs/Bcrypt';

test('422: Parameter Error', async () => {
    const request = {
        identity: {},
        body: <RegisterRequest>{
            username: '',
            password: '',
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(422);
});

test('409: Conflict', async () => {
    const user = await UserSeeder.create(1);
    const request = {
        identity: {},
        body: <RegisterRequest>{
            username: user.username,
            password: user.password,
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);
    console.log(result);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(409);
});

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <RegisterRequest>{
            username: faker.internet.userName(),
            password: await Bcrypt.encrypt('test'),
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
