const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

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
const getShiftById = ({ params }, res, next) => {
  const shiftId = params.sid;
  const shift = SHIFTS.find((s) => s.id === shiftId);
  if (!shift) {
    throw new HttpError("Could not find a shift for the provided ID", 404);
  }
  console.log("GET request in shifts");
  res.json({ shift }); // Any data type that can be converted to JSON, returns it upon request
  // place: place
};

// GET: Return 0 or more shifts associated with Employee
const getShiftsByUserId = ({ params }, res, next) => {
  const userId = params.uid;

  // Return all shifts where the ID matches: 0 or more shifts
  const userShifts = SHIFTS.filter((s) => s.employeeId === userId);
  if (!userShifts || userShifts.length === 0) {
    throw new HttpError("Could not find shifts for the provided user ID", 404);
  }
  console.log("GET request in shift for a user");
  res.json({ userShifts });
};

// POST: Add a new 'Shift' to the database
const createShift = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const { date, time, employeeId } = req.body;
  const createdShift = {
    id: uuidv4(),
    date,
    time,
    employeeId,
  };

  SHIFTS.push(createdShift);

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
