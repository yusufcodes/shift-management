const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const USERS = [
  {
    id: "1",
    name: "Yusuf Chowdhury",
    email: "yusuf@gmail.com",
    password: "pass123",
  },
];

// GET: Return all users
const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

// POST: Add a new user to the database
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please check your data", 422);
    return next(error);
  }

  const { name, email, password, shifts } = req.body;

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

  // To Do: Store password securely - encrypted
  const newUser = new User({
    name,
    email,
    password,
    shifts,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again", 500);
    return next(error); // Stop code execution
  }

  // To Do: Remove password from response during encryption / security
  res.json(201).json({ user: newUser.toObject({ getters: true }) });
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

  if (!existing || existing.password !== password) {
    const error = new HttpError("Invalid credentials - could not login", 401);
    return next(error);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
