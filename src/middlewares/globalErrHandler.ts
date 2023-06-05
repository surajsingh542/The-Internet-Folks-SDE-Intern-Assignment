import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const globalErrHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // message
  // status
  // status code
  // stack

  const statuscode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;
  const stack = err.stack;
  res.status(statuscode).json({
    status,
    message,
    stack,
  });
};

export default globalErrHandler;
