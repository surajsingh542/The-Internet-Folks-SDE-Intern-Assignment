import { Request, Response, NextFunction } from "express";
import { getTokenFromHeader } from "../universe/v1/utils/getTokenFromHeader";
import { verifyToken } from "../universe/v1/utils/verifyToken";

export const isLogin = (req: Request, res: Response, next: NextFunction) => {
  // get token from req header
  const token = getTokenFromHeader(req);
  // verify
  const decodedUser = verifyToken(token);
  // save the user into req obj
  res.locals.user = decodedUser.id;
  if (!decodedUser) {
    return res.status(401).json({
      status: false,
      errors: [
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
      ],
    });
  }
  next();
};
