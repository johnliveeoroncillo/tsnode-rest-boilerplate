import { execute } from './handler';
import { SampleMongoUpdateRequest } from './request';
import { TestReponse, HttpRequest, KeyValue } from '../../../../../../core/libs/ApiEvent';

test('200: SUCCESS', async () => {
    const request = {
        identity: {},
        body: <SampleMongoUpdateRequest>{
            name: 'value',
        },
        params: <KeyValue>{
            id: 'test',
        },
        query: <KeyValue>{},
    };

    const result = await execute(request as HttpRequest, TestReponse);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');

    expect(result.code).toBe(200);
});