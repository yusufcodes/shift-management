require("dotenv").config();

const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = req.headers["x-authorization"];
  const decoded = jwt.verify(token, process.env.SECRET);
  console.log(decoded);
  req.userData = { userId: decoded.userId };
  next();

  if (!token) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
  if (!decoded.admin) {
    const error = new HttpError(
      "Authentication failed - no admin privileges",
      401
    );
    return next(error);
  }
};
