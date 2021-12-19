import { execute } from './handler';
import { LoginRequest } from './request';
import express, { Request, Response, NextFunction, Router } from "express";
import { Code } from 'typeorm';
import { TestReponse, nextFunction } from '../../core/libs/ApiEvent';
const router = express.Router();


test('200: SUCCESS', async () => {
    const request = {
        body: <LoginRequest>{
            email: 'John',
            password: 'test',
        },
        path: {

        },
        query: {

        }
    } as Request

    const result = await execute(request, TestReponse, nextFunction);
    const response = result.body;

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});