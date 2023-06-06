import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/AppErr";

export default function ErrorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // console.error(error);

  if (error instanceof CustomError) {
    return response.status(error.statusCode).json({
      status: false,
      errors: error.serialize(),
    });
  }

  return response.status(500).json({
    status: false,
    errors: [
      {
        message: error.message || "Something unexpected happened!",
      },
    ],
  });
}
