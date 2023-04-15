const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return jwt.verify(token, "anysecretkey", (err, decoded) => {
    if (err) {
      console.log("Decode error", err);
      return false;
    } else {
      return decoded;
    }
  });
};

module.exports = verifyToken;
