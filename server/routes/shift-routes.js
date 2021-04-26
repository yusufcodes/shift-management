const express = require("express");
const { check } = require("express-validator");

const shiftController = require("../controllers/shift-controller");
const checkAuthAdmin = require("../middleware/authAdmin");
const checkAuthUser = require("../middleware/authUser");

const router = express.Router();

router.get("/all", shiftController.getAllShifts);
router.get("/id/:sid", shiftController.getShiftById);
router.get("/user/:uid", shiftController.getShiftsByUserId);
router.use(checkAuthUser);
router.get("/current", shiftController.getCurrentShifts);
router.use(checkAuthAdmin);
router.post("/", shiftController.createShift);
router.patch(
  "/:sid",
  check("starttime").not().isEmpty(),
  check("endtime").not().isEmpty(),
  shiftController.updateShift
);
router.delete("/:sid", shiftController.deleteShift);

module.exports = router;
