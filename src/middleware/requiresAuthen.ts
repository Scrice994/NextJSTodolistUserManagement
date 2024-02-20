import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuthen: RequestHandler = (req, res, next) => {
    console.log(req.headers);
    if(req.user){
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
}