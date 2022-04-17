import { Request, Response, NextFunction } from 'express';
export interface KeyValue {
    [key: string]: string | boolean | number | undefined;
}

export enum METHODS {
    post = 'post',
    get = 'get',
    delete = 'delete',
    put = 'put',
    patch = 'patch',
}

export interface Config {
    [key: string]: RouteConfig;
}
export interface RouteConfig {
    endpoint: string;
    method: METHODS;
    middleware?: string;
    handler: string;
    enabled: boolean;
    version?: string;
    prefix?: string;

    timezone?: string;
    autostart?: boolean;
    cron?: string;
}
export interface HttpResponse {
    code: number;
    message: string | boolean | number | undefined;
}

export const TestReponse = {} as Response;
(TestReponse.status = () => TestReponse),
    (TestReponse.json = (json) => {
        return json;
    });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nextFunction = function (err: string) {
    console.error(err);
};

export interface ApiEvent {
    request: Request;
    response: Response;
    next: NextFunction;
}
export interface TokenData {
    data: Identity;
    iat: number;
    exp: number;
}

//EDIT INTERFACE TO YOUR DESIRED INDENTITY
export interface Identity {
    id: number | string;
    uuid: string;
}
export interface HttpRequest extends Request {
    identity?: Identity;
}

export const Authorize = (data: TokenData, request: HttpRequest, next: NextFunction): void => {
    const user_data = data?.data ?? undefined;
    if (user_data) request.identity = user_data;
    return next();
};
