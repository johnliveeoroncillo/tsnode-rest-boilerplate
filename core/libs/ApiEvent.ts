import { Request, Response, NextFunction } from "express";


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

export interface HttpResponse {
    statusCode: number;
    body: any;
}

export const TestReponse = {} as Response;
TestReponse.status = () => TestReponse,
TestReponse.json = (json) => {
    return json;
}

export interface ApiEvent {
    request: Request,
    response: Response,
    next: NextFunction
}
