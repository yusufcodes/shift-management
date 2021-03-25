const express = require("express");
const { check } = require("express-validator");

const shiftController = require("../controllers/shift-controller");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.get("/shift/:sid", shiftController.getShiftById);

router.get("/user/:uid", shiftController.getShiftsByUserId);

// Any request past this point must have a token / be authenticated.
router.use(checkAuth);

router.get("/current", shiftController.getCurrentShifts);

// todo: add checks here for inputs.
router.post("/", shiftController.createShift);

/* Note: Can have multiple middlewares such as here, we use express validator to perform
checks before proceeding to running the controller */
router.patch(
  "/:sid",
  check("starttime").not().isEmpty(),
  check("endtime").not().isEmpty(),
  shiftController.updateShift
);

router.delete("/:sid", shiftController.deleteShift);

module.exports = router;
