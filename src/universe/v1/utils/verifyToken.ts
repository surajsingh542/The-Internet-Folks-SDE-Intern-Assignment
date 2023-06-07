const jwt = require("jsonwebtoken");

export const verifyToken = (token: string | object) => {
  return jwt.verify(token, "anysecretkey", (err: any, decoded: any) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};
