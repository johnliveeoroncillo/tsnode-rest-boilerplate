const path = require("path");
const fs = require("fs");
const routes: any = [];
import { Request, Response, Application } from "express";
import { Response500 } from "./defaults";
const mainDir = require("path").dirname(__dirname).replace(/\\/g, '/');

const loadRoutes = (dir?: string): Promise<any> => {
  if (!dir) dir = `${require("path").dirname(__dirname)}/apis`;

    var fs = require('fs');
    var path = require('path');
    
  return new Promise((resolve, reject) => {
    fs.readdirSync(dir).forEach((file: string) => {
      const absolute = path.join(dir, file);

      if (fs.statSync(absolute).isDirectory()) return loadRoutes(absolute);
      else return routes.push(absolute);
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

      if (!fs.statSync(absolute).isDirectory()) migrations.push(absolute);
    });

    return resolve(migrations);
  });
};

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

const API_RESPONSE = (response: any, res: Response) => {
  let code = Response500.code;
  let new_response:any = {};

  try {
    new_response = JSON.parse(JSON.stringify(response));
    code = new_response?.code ?? 500;
    new_response.code = code;
    new_response.message = new_response?.message ?? response.toString();
  }
  catch(e:any) {
      new_response = {code,message:response.toString()};
  }
  return res.status(code).json(new_response);
};



export { generateRoute, loadRoutes, loadMigrations, API_RESPONSE };
