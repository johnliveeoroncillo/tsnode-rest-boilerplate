import { KeyValue } from '../../../../core/libs/ApiEvent';
import { SocketIOData } from '../../../../core/libs/SocketIO';

export async function execute(io: SocketIOData, payload: unknown): Promise<KeyValue | string | boolean | number> {
    try {
        // const connection: Connection = await Mysql.getConnection();

        console.log('coming from client', payload);
        console.log(io.socket.id);

        /**
         * Ref: https://socket.io/docs/v3/broadcasting-events/
         * ADD YOUR CUSTOM ACTION HERE
         * SAMPLES:
         */

        /** SEND TO SELF */
        io.socket.emit('test_event', 'my_payload_self');

        /** BROADCAST TO ALL INCLUDING SENDER */
        io.socketio.broadcastAll('test_all', 'my_payload_all');

        /** BROADCAST TO ALL EXCLUDING SENDER */
        io.socket.broadcast.emit('test_broadcast', 'test');

        /** BROADCAST THE socket_test EVENT TO ALL CLIENTS EXCLUDING SENDER */
        io.socket.broadcast.emit('socket_test', payload);
        return true;
    } catch (e: any) {
        throw new Error(e);
    }
}
