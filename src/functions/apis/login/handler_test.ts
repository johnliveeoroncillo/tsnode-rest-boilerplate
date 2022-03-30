import { execute } from './handler';
import { LoginRequest } from './request';
import { TestReponse, HttpRequest } from '../../../../core/libs/ApiEvent';
import * as faker from 'faker';
import { UserSeeder } from '../../../../seeder/UserSeeder';

test('422: PARAMETER ERROR', async () => {
    const request = {
        identity: {},
        body: <LoginRequest>{
            username: '',
            password: '',
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('errors');

    expect(result.code).toBe(422);
});

test('404: USERNAME NOT FOUND', async () => {
    const request = {
        identity: {},
        body: <LoginRequest>{
            username: faker.internet.userName(),
            password: 'test',
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(404);
});

test('400: PASSWORD ERROR', async () => {
    const user = await UserSeeder.create(1);
    const request = {
        identity: {},
        body: <LoginRequest>{
            username: user.username,
            password: faker.internet.password(),
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');

    expect(result.code).toBe(400);
});

test('200: SUCCESS', async () => {
    const user = await UserSeeder.create(2);
    const request = {
        identity: {},
        body: <LoginRequest>{
            username: user.username,
            password: 'test',
        },
        params: {},
        query: {},
    } as HttpRequest;

    const result = await execute(request, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});
