const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controller");
const checkAuthUser = require("../middleware/authUser");

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
router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  userController.login
);

router.use(checkAuthUser);
router.patch(
  "/update/:uid",
  [check("email").normalizeEmail().isEmail()],
  userController.updateDetails
);

module.exports = router;
