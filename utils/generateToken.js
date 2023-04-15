const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "anysecretkey", { expiresIn: "3h" });
};

module.exports = generateToken;
