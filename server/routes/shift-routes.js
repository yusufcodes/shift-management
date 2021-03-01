const express = require("express");
const { check } = require("express-validator");

const shiftController = require("../controllers/shift-controller");

const router = express.Router(); // Creates a router to handle routing

router.get("/:sid", shiftController.getShiftById);

router.get("/user/:uid", shiftController.getShiftsByUserId);

// Extra middleware: check
router.post(
  "/",
  [check("date").not().isEmpty(), check("time").not().isEmpty()],
  shiftController.createShift
);

router.patch(
  "/:sid",
  [check("date").not().isEmpty(), check("time").not().isEmpty()],
  shiftController.updateShift
);

router.delete("/:sid", shiftController.deleteShift);

module.exports = router;
