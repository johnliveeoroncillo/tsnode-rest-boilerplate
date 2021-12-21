
/*
    Your Custom Response */

export class SUCCESS {
    code = 200;
    message = 'Success';
}

export class Duplicate {
    code = 409;
    message = 'Username already exists';
}