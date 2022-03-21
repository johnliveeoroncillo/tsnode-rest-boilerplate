import { createServer } from "net";  
import { env } from "./Env";

interface Options {
    host: string;
    port: number;
}

export class Events {
    private defaultOptions: Options = {
        host: env('EVENT_HOST','127.0.0.0'),
        port: Number(env('EVENT_PORT', 6060)),
    }
    private options: Options;
}