import { Request, Response, NextFunction } from "express";
import { PlatformError } from "../CustomErrors/PlatfotmError";

const validateDto = (ajvValidate: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = ajvValidate(req.body);
    if (!valid) {
      const errors = ajvValidate.errors;
      console.log(errors);

      throw new PlatformError(errors);
    }
    next();
  };
};

export default validateDto;
