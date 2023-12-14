import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAutho: RequestHandler = (req, res, next) => {
    if(req.user && req.user.userRole === "Admin"){
        next();
    } else {
        next(createHttpError(403, "Unauthorized"));
    }
}