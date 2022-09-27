import { env } from '../../../../core/libs/Env';

test('CLIENT: SOCKET.io', async () => {
    const server = "0.0.0.0";  // change it to the address of your server
    const port = env('PORT', 6060); // change it to the port of your server
    const socket = require("socket.io-client")("http://" + server + ":" + port);

    let response = {};
    socket.on("new_connection", (data: any) => {
        response = data;
        expect(response).toHaveProperty('socket_id');

        setTimeout(() => {
            /**
             * SEND TEST EVENT
             * ./socket/socket_test
             */
            socket.emit('socket_test', 'test_payload');
        }, 2000);
        
        setTimeout(() => {
            socket.disconnect();
        },10000);
    });

    socket.on('test_event', (payload: any) => {
        console.log('sent to self', payload);
    })

    socket.on('test_all', (payload: any) => {
        console.log('sent to all', payload);
    })

    socket.on('test_broadcast', (payload: any) => {
        console.log('sent to test broadcast', payload);
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected');
        process.exit();
    })
});
