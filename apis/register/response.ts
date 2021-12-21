
/*
    Your Custom Response */

import { HttpResponse } from "../../core/libs/ApiEvent";

export class Response200 {
    static SUCCESS: HttpResponse = {
        code: 200,
        message: 'Success',
    }
}

export class Duplicate {
    code = 409;
    message = 'Username already exists';
}