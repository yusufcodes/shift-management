const express = require("express");

const router = express.Router(); // Creates a router to handle routing
const HttpError = require("../models/http-error");

const USERS = [
  {
    id: "1",
    name: "Yusuf Chowdhury",
    email: "yusuf2106@hotmail.co.uk",
    image: "-",
    password: "SomePassword123",
    role: "Manager",
  },
];

module.exports = router;
