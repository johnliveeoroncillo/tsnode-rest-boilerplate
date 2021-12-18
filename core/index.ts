/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import fs from 'fs';
import { Request, Response, Application } from "express";
import { Response500 } from "./defaults";

const mainDir = path.dirname(__dirname).replace(/\\/g, '/');
const yaml = require('js-yaml');
const routes: Config[] = [];

export enum METHODS {
  post = 'post',
  get = 'get',
  delete = 'delete',
  put = 'put',
  patch = 'patch'
}

export interface Config {
  [key: string]: RouteConfig;
}

export interface RouteConfig {
  endpoint: string;
  method: METHODS;
  authorizer?: string;
  handler: string;
}


const loadRoutes = (dir: string = ''): Promise<Config[]> => {
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
  const migrations: any = [];
  return new Promise((resolve, reject) => {
    fs.readdirSync(dir).forEach((file: string) => {
      const absolute = path.join(dir, file);

      if(file.includes('sql')) 
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
  console.log('AVAILABLE ROUTES:', url);
  return url;
};

////v2
const getConfig = (path: string): Config | undefined => {
  try {
      const doc = yaml.load(fs.readFileSync(path, 'utf8'));
      return doc;
  } catch (e) {
    console.log(e);
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

const API_RESPONSE = (response: any, res: Response) => {
  let code:string = Response500.code.toString();
  let new_response:any = {};

  try {
    new_response = JSON.parse(JSON.stringify(response));
    code = new_response?.code ?? '500'
    code = isNaN(parseInt(code)) ? '500' : code;
    new_response.code = code;
    new_response.message = new_response?.message ?? response.toString();
  }
  catch(e: any) {
      new_response = {code,message:response.toString()};
  }
  return res.status(parseInt(code)).json(new_response);
};



export { loadCron, generateRoute, loadRoutes, loadMigrations, API_RESPONSE };
