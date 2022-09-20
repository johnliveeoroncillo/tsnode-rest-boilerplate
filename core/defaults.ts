interface ResponseDefault {
    code: number;
    message: string;
    data?: any;
    errors?: any;
}

//422
class ParameterError {
    code: number;
    message: string;
    errors: any;
    constructor(errors: any) {
        this.code = Response422.code;
        this.message = Response422.message;
        const parsedErrors: any = {};

        if (errors.details?.length) {
            errors.details?.forEach((element: any) => {
                const path = element.path[0];
                const message = element.message;
                parsedErrors[path] = message;
            });
        }
        this.errors = parsedErrors;
    }
}

//500
class InternalError {
    code: number;
    message: string;
    constructor(message?: any) {
        this.message = Response500.message;
        if (message) this.message;
        this.code = Response500.code;
    }
}

//200
class Success {
    code: number = Response200.code;
    message: string = Response200.message;
    data?: any;
}

//401
class Unauthorized {
    code: number = Response401.code;
    message: string = Response401.message;
}
class MissingAuthToken {
    code: number = Response401.code;
    message = 'Missing authentication token';
}

//409
class EntityAlreadyExists {
    code: number;
    message: string;
    constructor(message?: any) {
        this.message = Response409.message;
        if (message) this.message = message;
        this.code = Response409.code;
    }
}

class CustomResponse {
    constructor(response: ResponseDefault, message?: string) {
        if (message) response.message = message;
        return {
            ...response,
        };
    }
}

//410
class OtpExpired {
    code: number;
    message: string;
    constructor(message?: any) {
        this.message = Response410.message;
        if (message) this.message = message;
        this.code = Response410.code;
    }
}

//404
class NotFound {
    code: number;
    message: string;
    constructor(message?: any) {
        this.message = Response404.message;
        if (message) this.message = message;
        this.code = Response404.code;
    }
}

//200 GET
const Response200 = {
    code: 200,
    message: 'Success',
};
//201 CREATED NEW ENTITY POST
const Response201 = {
    code: 201,
    message: 'Created',
};
//202 ACCEPTED PATCH
const Response202 = {
    code: 202,
    message: 'Accepted',
};
//204 NO CONTENT DELETE
const Response204 = {
    code: 204,
    message: 'No Content',
};
//400 BAD REQUEST
const Response400 = {
    code: 400,
    message: 'Bad Request',
};
//401 UNAUTHORIZED
const Response401 = {
    code: 401,
    message: 'Unauthorized',
};
//403 ACCESS DENIED
const Response403 = {
    code: 403,
    message: 'Access Denied',
};
//404 ENTITY NOT FOUND
const Response404 = {
    code: 404,
    message: 'Not Found',
};
//409 ENTITY ALREADY EXISTS
const Response409 = {
    code: 409,
    message: 'Entity already Exists',
};
//410 OTP ALREADY EXPIRED
const Response410 = {
    code: 410,
    message: 'OTP already expired',
};
//419 TOKEN WAS EXPIRED
const Response419 = {
    code: 419,
    message: 'Token was expired',
};
//422 PARAMETER ERROR
const Response422 = {
    code: 422,
    message: 'Parameter Error',
};
//423 PARAMETER ERROR
const Response423 = {
    code: 423,
    message: 'Max Tries',
};
//500 INTERNAL SERVER ERROR
const Response500 = {
    code: 500,
    message: 'Something went wrong',
};
//503 SERVICE UNAVAILABLE
const Response503 = {
    code: 503,
    message: 'Service Unavailable',
};

export {
    NotFound,
    OtpExpired,
    MissingAuthToken,
    Unauthorized,
    CustomResponse,
    EntityAlreadyExists,
    Success,
    InternalError,
    ParameterError,
    Response200,
    Response201,
    Response202,
    Response204,
    Response400,
    Response401,
    Response403,
    Response404,
    Response409,
    Response410,
    Response419,
    Response422,
    Response423,
    Response500,
    Response503,
};
