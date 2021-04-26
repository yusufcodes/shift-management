const express = require("express");
const { check, query, param } = require("express-validator");

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
router.post(
  "/",
  check("starttime").not().isEmpty(),
  check("endtime").not().isEmpty(),
  check("employeeId").not().isEmpty(),
  shiftController.createShift
);
router.patch(
  "/:sid",
  param("sid").isLength({ min: 24 }),
  check("starttime").not().isEmpty(),
  check("endtime").not().isEmpty(),
  shiftController.updateShift
);
router.delete(
  "/:sid",
  param("sid").isLength({ min: 24 }),
  shiftController.deleteShift
);

module.exports = router;
