const express = require("express");
const shiftController = require("../controllers/shift-controller");

const router = express.Router(); // Creates a router to handle routing

router.get("/:sid", shiftController.getShiftById);
router.get("/user/:uid", shiftController.getShiftByUserId);
router.post("/", shiftController.createShift);

module.exports = router;
