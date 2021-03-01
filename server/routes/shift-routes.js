const express = require("express");
const shiftController = require("../controllers/shift-controller");

const router = express.Router(); // Creates a router to handle routing

router.get("/:sid", shiftController.getShiftById);
router.get("/user/:uid", shiftController.getShiftsByUserId);
router.post("/", shiftController.createShift);
router.patch("/:sid", shiftController.updateShift);
router.delete("/:sid", shiftController.deleteShift);

module.exports = router;
