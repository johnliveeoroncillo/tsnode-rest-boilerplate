import { Request, Response, NextFunction } from "express";
interface KeyValue {
    [key: string]: any;
}

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
    middleware?: string;
    handler: string;
}
export interface HttpResponse {
    code: number;
    message: any;
}

export const TestReponse = {} as Response;
TestReponse.status = () => TestReponse,
TestReponse.json = (json) => {
    return json;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nextFunction = function(err: string) { console.error(err); };

export interface ApiEvent {
    request: Request,
    response: Response,
    next: NextFunction
}

interface Identity {
    id: number | string;
}
export interface HttpRequest extends Request {
    identity?: Identity;
} 

export const Authorize = (data: KeyValue, request: HttpRequest, next: NextFunction) => {
    const user_data = data?.data ?? {};
    request.identity = user_data;
    return next();
};