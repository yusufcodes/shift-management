const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// GET: Return all users
const getUsers = async (req, res, next) => {
  let users;

  try {
    // Return all fields except for the password (security)
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Getting users failed, please try again", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// POST: Add a new user to the database
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  // TODO: Make error message more specific?
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please check your data", 422);
    return next(error);
  }

  const { name, email, password } = req.body;

  let existing;

  try {
    existing = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed, try again ", 500);
    return next(error);
  }

  if (existing) {
    const error = new HttpError(
      "User exists already. please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Couldnt not create a user, please try again",
      500
    );
    return next(error);
  }

  // TODO: Store password securely - encrypted
  const newUser = new User({
    name,
    email,
    hashedPassword,
    shifts: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again", 500);
    return next(error); // Stop code execution
  }

  // To Do: Remove password from response during encryption / security
  res.json({ user: newUser.toObject({ getters: true }) });
};

// POST: Use login details to sign user into account
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existing;

  try {
    existing = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, try again ", 500);
    return next(error);
  }

  if (!existing) {
    const error = new HttpError("Invalid credentials - could not login", 401);
    return next(error);
  }

  let passwordValid = false;

  try {
    passwordValid = await bcrypt.compare(password, existing.password);
  } catch (err) {
    const error = new HttpError(
      "Could not login, check credentials and try again",
      500
    );
    return next(error);
  }

  if (!passwordValid) {
    const error = new HttpError("Invalid credentials - could not login", 401);
    return next(error);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
