const express = require("express");
const bodyParser = require("body-parser");
const shiftRouter = require("./routes/shift-routes");
const userRouter = require("./routes/user-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(bodyParser.json()); // Get JSON from any data from body of a request
// Auto calls next to move to the next middleware

// only forward requests to shiftRouter if req. url starts with /api/shifts/...
app.use("/api/shift", shiftRouter); // Listen out for routes from shiftRouter
app.use("/api/user", userRouter); // Listen out for routes from shiftRouter

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Error Handler
// 4 parameters = error handler, only requests with errors attached to it will run
app.use((error, req, res, next) => {
  if (res.headerSent) {
    // cannot send more headers if true
    return next(error);
  }
  // 500 = something wrong on the server, fallback value
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error has occurred!" });
});

app.listen(5000);
