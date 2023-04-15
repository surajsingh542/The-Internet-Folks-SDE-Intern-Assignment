const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  // get token from req header
  const token = getTokenFromHeader(req);
  // verify
  const decodedUser = verifyToken(token);
  // save the user into req obj
  req.user = decodedUser.id;
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

module.exports = isLogin;
