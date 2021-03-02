const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Shift = require("../models/shift");

let SHIFTS = [
  {
    id: "1",
    employeeId: "1",
    date: "Tuesday 8th February 2021",
    time: "16:00 - 22:00",
  },
  {
    id: "2",
    employeeId: "2",
    date: "Monday 8th February 2021",
    time: "16:00 - 22:00",
  },
  {
    id: "3",
    employeeId: "2",
    date: "Monday 8th February 2021",
    time: "16:00 - 22:00",
  },
];

// GET: Return a shift based on its ID
const getShiftById = async ({ params }, res, next) => {
  const shiftId = params.sid;

  let shift;

  try {
    shift = await Shift.findById(shiftId);
  } catch (err) {
    const error = new HttpError(
      "Database: Issue with getting shift by this ID",
      500
    );
    return next(error); // Stop code execution
  }

  if (!shift) {
    const error = new HttpError("Couldnt find shift by ID", 500);
    return next(error);
  }

  res.json({ shift: shift.toObject({ getters: true }) });
};

// GET: Return 0 or more shifts associated with Employee
const getShiftsByUserId = async ({ params }, res, next) => {
  const employeeId = params.uid;

  let userShifts;

  try {
    userShifts = await Shift.find({ employeeId: employeeId });
  } catch (err) {
    const error = new HttpError(
      "Database: Issue with getting shifts for this user",
      500
    );
    return next(error);
  }

  if (!userShifts || userShifts.length === 0) {
    const error = new HttpError(
      "Could not find shifts for the provided user ID",
      404
    );
    return next(error);
  }

  // getters: true removes underscore from id and adds it to the returned data
  res.json({
    userShifts: userShifts.map((shift) => shift.toObject({ getters: true })),
  });
};

// POST: Add a new 'Shift' to the database
const createShift = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const { datetime, employeeId } = req.body;

  // To Do: Once I create Date selection on front end, pass this in here - currently just uses current date.
  const createdShift = new Shift({
    datetime: new Date(),
    employeeId,
  });
  try {
    await createdShift.save();
  } catch (err) {
    const error = new HttpError("Creating shift failed, please try again", 500);
    return next(error); // Stop code execution
  }

  res.status(201).json({ shift: createdShift });
};

// PATCH: Update fields of any Shift
const updateShift = ({ body, params }, res, next) => {
  // TODO: What if we only want to update one single field ?
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const { date, time } = body;
  const shiftId = params.sid;

  // Use of Spread to create new copy of all the shifts
  const updatedShift = { ...SHIFTS.find((s) => s.id === shiftId) };
  const shiftIndex = SHIFTS.findIndex((s) => s.id === shiftId);

  updatedShift.date = date;
  updatedShift.time = time;

  SHIFTS[shiftIndex] = updatedShift;

  res.status(200).json({ shift: updatedShift });
};

// DELETE: Remove a shift from the database
const deleteShift = (req, res, next) => {
  const shiftId = req.params.sid;

  if (!SHIFTS.find((s) => s.id !== shiftId)) {
    throw new HttpError("Could not find a shift with this ID", 404);
  }

  // Filter out the shift to be deleted from the array
  SHIFTS = SHIFTS.filter((p) => p.id !== shiftId);
  res.status(200).json({ message: `Deleted place with ID ${shiftId}` });
};

exports.getShiftsByUserId = getShiftsByUserId;
exports.getShiftById = getShiftById;
exports.createShift = createShift;
exports.updateShift = updateShift;
exports.deleteShift = deleteShift;
