require("dotenv").config();

const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers["x-authorization"];
    if (!token) {
      const error = new HttpError("Authentication failed", 401);
      return next(error);
    }
    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded.admin) {
      const error = new HttpError(
        "Authentication failed - no admin privileges",
        401
      );
      return next(error);
    }

    req.userData = { userId: decoded.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
};
