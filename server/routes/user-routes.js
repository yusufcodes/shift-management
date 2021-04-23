const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/", userController.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength(6),
  ],
  userController.signup
);

// todo: add auth
router.patch(
  "/update/:uid",
  [check("email").normalizeEmail().isEmail()],
  userController.updateDetails
);
router.post("/login", userController.login);

module.exports = router;
