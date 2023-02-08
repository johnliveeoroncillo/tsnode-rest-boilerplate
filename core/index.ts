/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import fs, { appendFileSync, existsSync, writeFileSync } from 'fs';
import { Response } from 'express';
import { Response500 } from './defaults';
import { Config, HttpResponse, RouteConfig } from './libs/ApiEvent';
import glob from 'glob';
import { LogColor } from './libs/Logger';
import { Carbon } from './libs/Carbon';
const Table = require('cli-table');
const colors = require('colors/safe');

const yaml = require('js-yaml');
const routes: Config[] = [];

export interface ApiRecord {
    config: RouteConfig;
    api_key: string;
    middlewares: string[];
}

const listRoutes = (app: ApiRecord[]) => {
    const table = new Table({
        head: [
            colors.red.bold('#'),
            colors.red.bold('Endpoint'),
            colors.red.bold('Method'),
            colors.red.bold('Middlewares'),
        ],
        style: { 'padding-left': 1, 'padding-right': 1 },
    });
    for (let i = 0; i < app.length; i++) {
        const current = app[i];
        const config = current.config;
        const middlewares = current.middlewares;

        let method = '';
        switch (config.method) {
            case 'post':
                method = colors.blue(config.method);
                break;
            case 'patch':
            case 'put':
                method = colors.yellow(config.method);
                break;
            case 'delete':
                method = colors.red(config.method);
                break;
            case 'get':
                method = colors.green(config.method);
                break;
            default:
                method = colors.grey(config.method);
        }

        table.push([i + 1, colors.yellow.bold(config.endpoint), method, colors.magenta(middlewares.join(', '))]);
        // table_data.push({
        //     'Endpoint': config.endpoint,
        //     'Method': config.method,
        //     'Middlewares': middlewares.join(', ')
        // });
    }

    console.log(table.toString());
};

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
    if (code > 400) {
        logMessage(new_response);
    }

    if (res) res.status(code).json(new_response);
    return {
        ...new_response,
    };
};

const logMessage = (message: any): void => {
    const logname = `./logs/${Carbon.now('YYYY-MM-DD')}.log`;
    if (!existsSync(logname)) {
        writeFileSync(logname, '');
    }

    const messageLog = `
=== ${Carbon.now('YYYY-MM-DD hh:mm:ss A')} ===}
ERROR:
\n
${JSON.stringify(message, undefined, 4)}
\n
======\n`;
    appendFileSync(logname, messageLog);
};

export { loadCron, generateRoute, loadRoutes, loadMigrations, API_RESPONSE, listRoutes, logMessage };
