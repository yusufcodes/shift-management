const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const USERS = [
  {
    id: "1",
    name: "Yusuf Chowdhury",
    email: "yusuf@gmail.com",
    password: "pass123",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const { name, email, password } = req.body;

  const userFound = USERS.find((u) => u.email === email);
  if (userFound) {
    throw new HttpError("Could not create user, email already in use!", 422);
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  USERS.push(newUser);

  res.json(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("User/pass combination not found", 401);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
