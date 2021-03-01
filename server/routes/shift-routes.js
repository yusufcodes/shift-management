const express = require("express");
const { check } = require("express-validator");

const shiftController = require("../controllers/shift-controller");

const router = express.Router();

router.get("/:sid", shiftController.getShiftById);

router.get("/user/:uid", shiftController.getShiftsByUserId);

/* Note: Can have multiple middlewares such has here, we use express validator to perform
checks before proceeding to running the controller */
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
