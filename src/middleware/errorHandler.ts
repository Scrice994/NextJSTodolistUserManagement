import { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";

const ErrorHandler: ErrorRequestHandler = (error, req, res, next) => {

    console.log(error);

    let status = error.status || 500;
    let errorMessage = error.message || "An unknown error occour";

    if(isHttpError(error)){
        status = error.status;
        errorMessage = error.message
    }

    res.status(status).json({ error: errorMessage });
}

export default ErrorHandler;