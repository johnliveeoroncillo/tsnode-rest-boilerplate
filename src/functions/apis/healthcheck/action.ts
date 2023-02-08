import axios, { AxiosInstance } from 'axios';
import { randomUUID } from 'crypto';
import { ApiRecord, loadRoutes } from '../../../../core';
import { Config, METHODS, RouteConfig } from '../../../../core/libs/ApiEvent';
import { TokenService } from '../../../../core/libs/TokenService';
import os from 'os';

export class HealthcheckAction {
    async execute(): Promise<void> {
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

                        const token = await TokenService.adminJWT({
                            id: 1,
                            uuid: randomUUID(),
                        });

                        // const { execute } = await import(`.${handler}`);
                        // const callbacks = [];
                        // if (middleware && !Array.isArray(middleware)) {
                        //     const { execute } = await import(`../src/functions/middlewares/${middleware}`);
                        //     callbacks.push(execute);

                        //     api_record[index].middlewares.push(middleware);
                        // } else if (middleware && Array.isArray(middleware)) {
                        //     for (let i = 0; i < middleware.length; i++) {
                        //         const mw = middleware[i];
                        //         const { execute } = await import(`../src/functions/middlewares/${mw}`);
                        //         callbacks.push(execute);
                        //     }
                        //     api_record[index].middlewares.push(...middleware);
                        // }

                        /**
                         * MODIFY ENDPOINT SETTINGS
                         */
                        if (prefix && prefix !== '') endpoint = endpoint.replace(/<prefix>/g, `/${prefix}`);
                        else endpoint = endpoint.replace(/<prefix>/g, '');

                        if (version && version !== '') endpoint = endpoint.replace(/<version>/g, `/v${version}`);
                        else endpoint = endpoint.replace(/<version>/g, '');

                        const axiosConfig = {
                            url: `${os.hostname}${endpoint}`,
                            method,
                        };

                        const response = await axios(axiosConfig);
                        console.log(response);
                    }
                }
            }
        });
    }
}
