import { parentPort } from 'worker_threads';

parentPort?.on('message', async (payload: any) => {
    const { event, data } = payload;
    const { execute } = await import(`../.${event.handler}`);
    const response = await execute(data);
    parentPort?.postMessage(response);
});
