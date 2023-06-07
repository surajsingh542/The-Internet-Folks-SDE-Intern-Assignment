import { Request } from "express";
export const getTokenFromHeader = (req: Request) => {
  const headerObj = req.headers;
  let token: string;
  if (headerObj["authorization"]) {
    token = headerObj["authorization"].split(" ")[1];
  } else {
    token = "";
  }
  if (token !== undefined || token !== "") {
    return token;
  } else {
    return {
      status: "Failed",
      message: "There is no token attached to the header",
    };
  }
};
