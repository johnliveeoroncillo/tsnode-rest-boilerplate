/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import fs from 'fs';
import { Response } from 'express';
import { Response500 } from './defaults';
import { Config, HttpResponse, RouteConfig } from './libs/ApiEvent';
import glob from 'glob';

const yaml = require('js-yaml');
const routes: Config[] = [];

const listRoutes = require('express-list-routes');

const loadRoutes = (dir = ''): Promise<Config[]> => {
    return new Promise((resolve) => {
        glob(`${__dirname}/../src/functions/apis/**/*.yml`, (er: any, files: any) => {
            if (files?.length) {
                files.forEach(async (file: string) => {
                    const config = getConfig(file);
                    if (config) routes.push(config);
                });
            }

            return resolve(routes);
        });
    });
};

const loadMigrations = (): Promise<any> => {
    const dir = `${__dirname}/../migrations`;
    const migrations: string[] = [];
    console.log(dir);
    return new Promise((resolve) => {
        fs.readdirSync(dir).forEach((file: string) => {
            console.log(file);
            const absolute = path.join(dir, file);

            if (file) if (!fs.statSync(absolute).isDirectory()) migrations.push(absolute);
        });

        return resolve(migrations);
    });
};

////v1
const generateRoute = (path: string): string => {
    const split = path.toString().replace(/\\/g, '/').split('/');
    const length = split.length;
    let url = '';
    if (length) {
        const find = split.findIndex((el) => el == 'apis');
        const newSplit = split.slice(find + 1);
        const splitUrl = newSplit.join('/');
        url = `/${splitUrl
            .replace(/_/g, ':')
            .replace(/\.[^.]*$/, '')
            .replace(/[/]index/g, '')}`;
    }
    return url;
};

////v2
export const getConfig = (path: string): Config | undefined | any => {
    try {
        const doc = yaml.load(fs.readFileSync(path, 'utf8'));
        return doc;
    } catch (e) {
        return undefined;
    }
};

const loadCron = (): void => {
    const dir = `${__dirname}/../src/functions/cron`;
    if (!fs.existsSync(dir)) return;

    const cron = require('node-cron');
    fs.readdirSync(dir).forEach(async (file: string) => {
        const absolute = path.join(dir, file);

        if (fs.statSync(absolute).isDirectory()) {
            if (fs.existsSync(absolute)) {
                const cron_api = getConfig(`${absolute}/config.yml`);
                if (cron_api) {
                    const api_key: string = Object.keys(cron_api)[0];
                    const config: RouteConfig = cron_api[api_key];

                    if (config) {
                        const enabled: boolean = config?.enabled ?? false;
                        const handler: string = config?.handler ?? '';
                        const frequency: string = config?.cron ?? '';
                        const timezone: string = config?.timezone ?? 'Asia/Manila';

                        if (enabled && frequency && timezone && handler) {
                            const { execute } = await import(`.${handler}`);
                            cron.schedule(frequency, execute, {
                                scheduled: enabled,
                                timezone: timezone,
                            });
                        }
                    }
                }
            }
        }
    });
};

const API_RESPONSE = (response: any, res?: Response): HttpResponse => {
    let code: number = Response500.code;
    let new_response: any = {};

    try {
        new_response = JSON.parse(JSON.stringify(response));
        code = new_response?.code ?? 500;
        code = isNaN(code) ? 500 : code;
        new_response.code = code;
        new_response.message = new_response?.message ?? response.toString();
    } catch (e: any) {
        new_response = { code, message: response.toString() };
    }
    if (res) res.status(code).json(new_response);
    return {
        ...new_response,
    };
};

export { loadCron, generateRoute, loadRoutes, loadMigrations, API_RESPONSE, listRoutes };
