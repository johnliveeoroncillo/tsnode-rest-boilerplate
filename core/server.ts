/** source/server.ts */
import http from 'http';
import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { loadRoutes, API_RESPONSE, loadCron, listRoutes, ApiRecord } from './';
import { Config, METHODS, RouteConfig } from './libs/ApiEvent';
import { Response404 } from './defaults';
import 'reflect-metadata';
import cors from 'cors';
import { env } from './libs/Env';
import { Logger } from './libs/Logger';
import { Events } from './libs/Events';
import { ENV } from '../src/helpers/Enums';

const app: Express = express();

/** LOAD CRON */
loadCron();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
/** Remove X-Powered-By */
app.disable('x-powered-by');

const corsOptions = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'origin, X-Requested-With,Content-Type,Accept, Authorization, Content-Type',
    methods: 'GET,POST,DELETE,PUT,PATCH',
    Accept: 'application/json',
    origin: true,
    credentials: true,
    withCredentials: true,
};
app.use((req: Request, res: Response, next: NextFunction) => {
    ////TEMPORARILY REMOVED
    // const origins = process.env?.ALLOWED_ORIGINS ?? '';
    // const allowedOrigins = origins.split(',');
    // const origin: string = req.headers?.host ?? '';
    // console.log(origin, allowedOrigins);

    // if (allowedOrigins.includes(origin)) {
    //   console.log('ALLOWED', origin);
    //   corsOptions["Access-Control-Allow-Origin"] = origin; // restrict it to the required domain
    // }
    // console.log(corsOptions)
    app.use(cors(corsOptions));
    next();
});

/** Routes */
loadRoutes().then(async (routes) => {
    if (routes.length) {
        const api_record: ApiRecord[] = [];
        for (const key in routes) {
            const api_key: string = Object.keys(routes[key])[0];
            const api_config: Config = routes[key];
            const route: RouteConfig = api_config[api_key];

            const index =
                api_record.push({
                    api_key,
                    config: route,
                    middlewares: [],
                }) - 1;

            const enabled = route?.enabled ?? false;
            if (enabled) {
                let endpoint = route.endpoint.replace(/{/g, ':').replace(/}/g, '');
                endpoint = `<prefix><version>${endpoint}`;
                const handler = route.handler;
                const method = METHODS?.[route.method] ?? '';
                const middleware = route.middleware;
                const prefix = route?.prefix ?? '';
                const version = route?.version ?? '';

                const { execute } = await import(`.${handler}`);
                const callbacks = [];
                if (middleware && !Array.isArray(middleware)) {
                    const { execute } = await import(`../src/functions/middlewares/${middleware}`);
                    callbacks.push(execute);

                    api_record[index].middlewares.push(middleware);
                } else if (middleware && Array.isArray(middleware)) {
                    for (let i = 0; i < middleware.length; i++) {
                        const mw = middleware[i];
                        const { execute } = await import(`../src/functions/middlewares/${mw}`);
                        callbacks.push(execute);
                    }
                    api_record[index].middlewares.push(...middleware);
                }

                /**
                 * MODIFY ENDPOINT SETTINGS
                 */
                if (prefix && prefix !== '') endpoint = endpoint.replace(/<prefix>/g, `/${prefix}`);
                else endpoint = endpoint.replace(/<prefix>/g, '');

                if (version && version !== '') endpoint = endpoint.replace(/<version>/g, `/v${version}`);
                else endpoint = endpoint.replace(/<version>/g, '');

                callbacks.push(execute);
                app[method](endpoint, callbacks);
            }
        }
        app.use((req: Request, res: Response) => {
            API_RESPONSE(Response404, res);
        });

        listRoutes(api_record);
    }
});

/** Server */
const run = async () => {
    const httpServer = http.createServer(app);
    const PORT: string | number | undefined = env('PORT', 6060);

    httpServer.listen(PORT, () => {
        const environment = env('NODE_ENV', ENV.DEVELOPMENT);
        Logger.info('ENVIRONMENT', environment);
        Logger.serverStarted(PORT);
    });
};

run();
