import { Request, Response, NextFunction } from "express";

export interface ApiEvent {
    request: Request,
    response: Response,
    next: NextFunction
}
