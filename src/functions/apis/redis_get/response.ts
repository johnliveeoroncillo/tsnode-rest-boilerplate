import { HttpResponse } from '../../core/libs/ApiEvent';

/*
  Your Custom Response */
export class Response200 {
    static SUCCESS: HttpResponse = {
        code: 200,
        message: 'Success',
    };
}

export class KeyNotFound {
    code = 404;
    message = 'Key not found';
}
