import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../CustomErrors/ValidationError";

const validateDto = (ajvValidate: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = ajvValidate(req.body);
    if (!valid) {
      const errors = ajvValidate.errors;
      console.log("Error", errors);

      throw new ValidationError(errors);
    }
    next();
  };
};

export default validateDto;
