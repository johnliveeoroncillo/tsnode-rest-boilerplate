/** source/server.ts */
import http from "http";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { loadRoutes, API_RESPONSE, loadCron, listRoutes } from "./";
import { Config, METHODS, RouteConfig } from './libs/ApiEvent';
import { Response404 } from './defaults';
import "reflect-metadata";
import cors from 'cors';
import 'dotenv/config';
const app: Express = express();

loadCron();

/** Logging */
app.use(morgan("dev"));
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
  'methods': 'GET,POST,DELETE,PUT,PATCH',
  'Accept': 'application/json',
  origin: true,
  credentials: true,
  withCredentials: true
}
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ['http://localhost:3000']
  const origin:any = req.headers?.origin;
  if (allowedOrigins.includes(origin)) {
    console.log('ALLOWED', origin);
    corsOptions["Access-Control-Allow-Origin"] = origin; // restrict it to the required domain
  }
  app.use(cors(corsOptions));
  next();
})

/** Routes */
loadRoutes().then((routes) => {
  if (routes.length) {
    for(const key in routes) {
        const api_key: string = Object.keys(routes[key])[0];
        const api_config: Config = routes[key];
        const route: RouteConfig = api_config[api_key];

        const endpoint = route.endpoint;
        const handler = route.handler;
        const method = METHODS?.[route.method] ?? '';
        const middleware = route.middleware;

        // const middleware = route.middleware
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { execute } = require(`.${handler}`);

        const callbacks = []
        if (middleware) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const module = require(`../middlewares/${middleware}`);
            callbacks.push(module.execute);
        }
        callbacks.push(execute);
        app[method](endpoint, callbacks);

        listRoutes(app)
        // { prefix: '/v1/' };
    }
    app.use((req: Request, res: Response, next: NextFunction) => {
        API_RESPONSE(Response404, res);
    });
  }
});

/** Server */
const run = async () => {
  await require("../migrate");
  const httpServer = http.createServer(app);
  const PORT: any = process.env.PORT ?? 6060;
  httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
  );
};

run();
