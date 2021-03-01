const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router(); // Creates a router to handle routing

router.get("/", userController.getUsers);
router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
