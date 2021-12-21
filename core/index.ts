/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import fs from 'fs';
import { Request, Response, Application } from "express";
import { Response500 } from "./defaults";
import { Config, HttpResponse } from './libs/ApiEvent';

const mainDir = path.dirname(__dirname).replace(/\\/g, '/');
const yaml = require('js-yaml');
const routes: Config[] = [];

const listRoutes = require('express-list-routes');

const loadRoutes = (dir = ''): Promise<Config[]> => {
  if (!dir) dir = `${path.dirname(__dirname)}/apis`;

  return new Promise((resolve, reject) => {
    fs.readdirSync(dir).forEach((file: string) => {
        const absolute = path.join(dir, file);

        if (fs.statSync(absolute).isDirectory()) {
            if (fs.existsSync(absolute)) {
              const config = getConfig(`${absolute}/config.yml`);
              if (config) routes.push(config);
            }
        }
    }); 

    return resolve(routes);
  });
};

const loadMigrations = (): Promise<any> => {
  const dir = `${mainDir}/migrations`;
  const migrations: string[] = [];
  return new Promise((resolve) => {
    fs.readdirSync(dir).forEach((file: string) => {
      const absolute = path.join(dir, file);

      if(file.includes('ts')) 
        if (!fs.statSync(absolute).isDirectory()) migrations.push(absolute);
    });

    return resolve(migrations);
  });
};

////v1
const generateRoute = (path: string): string => {
  const split = path.toString().replace(/\\/g, '/').split("/");
  const length = split.length;
  let url = '';
  if (length) {
    const find = split.findIndex(el => el == 'apis');
    const newSplit = split.slice(find + 1);
    const splitUrl = newSplit.join('/');
    url = `/${splitUrl.replace(/_/g, ':').replace(/\.[^.]*$/,'').replace(/[/]index/g, '')}`;
  }
  return url;
};

////v2
const getConfig = (path: string): Config | undefined => {
  try {
      const doc = yaml.load(fs.readFileSync(path, 'utf8'));
      return doc;
  } catch (e) {
    return undefined;
  }
}

const loadCron = () => {
    const dir = `${path.dirname(__dirname)}/cron`;
    const cron = require('node-cron');
    fs.readdirSync(dir).forEach((file: string) => {
      const absolute = path.join(dir, file);

      if(file.includes('.ts')) {
          const { Cron } = require(`${absolute.replace(/\\/g, "/")}`);
          cron.schedule(Cron.cron, Cron.execute, {
              scheduled: Cron.auto_start,
              timezone: Cron.timezone
          });
      }
    });
   
}

const API_RESPONSE = (response: any, res: Response): HttpResponse => {
  let code:number = Response500.code;
  let new_response:any = {};

  try {
    new_response = JSON.parse(JSON.stringify(response));
    code = new_response?.code ?? 500
    code = isNaN(code) ? 500 : code;
    new_response.code = code;
    new_response.message = new_response?.message ?? response.toString();
  }
  catch(e: any) {
      new_response = {code,message:response.toString()};
  }
  res.status(code).json(new_response);
  return {
      statusCode: code,
      body: new_response,
  }
};


export { loadCron, generateRoute, loadRoutes, loadMigrations, API_RESPONSE, listRoutes };
