const jwt = require("jsonwebtoken");

export const generateToken = (id: string) => {
  return jwt.sign({ id }, "anysecretkey", { expiresIn: "3h" });
};
