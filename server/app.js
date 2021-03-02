require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const shiftRouter = require("./routes/shift-routes");
const userRouter = require("./routes/user-routes");

console.log(process.env.MONGO_PASSWORD);

/* Retrieve JSON form of the body of any request, then automatically move onto
the next middleware */
app.use(bodyParser.json());

// Listen out for defined routes
app.use("/api/shift", shiftRouter);
app.use("/api/user", userRouter);

// If a request lands here, the route could not be found - handled here
app.use(() => {
  throw new HttpError("Could not find this route.", 404);
});

// Error Handler Middlware: This has 4 parameters, so will only run if a request is returned with an error.
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

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
