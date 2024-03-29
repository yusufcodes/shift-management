require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true); // prevent deprecation warnings from MonogDB driver
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);

const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const shiftRouter = require("./routes/shift-routes");
const userRouter = require("./routes/user-routes");

/* Retrieve JSON form of the body of any request, then automatically move onto
the next middleware */
app.use(bodyParser.json());

/* Setting headers on any response */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Listen out for defined routes
app.use("/api/shift", shiftRouter);
app.use("/api/user", userRouter);

// If a request lands here, the route could not be found - handle error here
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
    console.log("Loading server...");
    app.listen(5000);
    console.log("Server running at http://www.localhost:5000");
  })
  .catch((err) => console.log(err));

module.exports = app;
