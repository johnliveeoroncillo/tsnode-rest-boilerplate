import { execute } from './handler';
import { LoginRequest } from './request';
import express, { Request, Response, NextFunction, Router } from "express";
import { Code } from 'typeorm';
const router = express.Router();

import http from 'http';


test('200: SUCCESS', async () => {
    const request = {
        body: JSON.stringify(<LoginRequest>{
            key: 'John'
        }),
        path: {

        },
        query: {

        }
    } as Request

    const nextFunction = function(err: string) { console.error(err); };
    const res = {} as Response;
    // replace the following () => res
    // with your function stub/mock of choice
    // making sure they still return `res`
    res.status = () => res;
    res.json = (json) => {
        return json;
    }

    const response = await execute(request, res, nextFunction);
    console.log(response);

    // expect(result).toHaveProperty('statusCode');
    // expect(result).toHaveProperty('body');
    // expect(response).toHaveProperty('code');
    // expect(response).toHaveProperty('message');
    // expect(response).toHaveProperty('errors');
    // // expect(response).toHaveProperty('errors.field_name'); // Add the required fields

    // expect(result.statusCode).toBe(422);
    // expect(response.code).toBe(422);
});