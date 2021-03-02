const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
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
const updateShift = async (req, res, next) => {
  // TODO: What if we only want to update one single field ?
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const shiftId = mongoose.Types.ObjectId(req.params.sid);
  console.log(shiftId);
  const { datetime } = req.body;

  let updatedShift;

  try {
    // Each param: Item to update, fields to update, return the newly updated data
    updatedShift = await Shift.findOneAndUpdate(
      { _id: shiftId },
      { datetime: datetime },
      { new: true }
    );
    console.log(updatedShift);
  } catch (err) {
    const error = new HttpError("Database: Could not update shift", 500);
    return next(error); // Stop code execution
  }

  if (!updatedShift || !updatedShift.length < 1) {
    const error = new HttpError(
      "No shift matching that ID was found, please try again.",
      404
    );
    return next(error);
  }

  res.status(200).json({ shift: updatedShift });
};

// DELETE: Remove a shift from the database
const deleteShift = async (req, res, next) => {
  const shiftId = mongoose.Types.ObjectId(req.params.sid);
  let deleteShift;

  try {
    deleteShift = await Shift.deleteOne({ _id: shiftId });
  } catch (err) {
    const error = new HttpError("Database: Could not delete shift", 500);
    return next(error);
  }

  if (deleteShift.ok !== 1) {
    const error = new HttpError("Database: Could not delete shift", 500);
    return next(error);
  }

  if (deleteShift.deletedCount !== 1) {
    const error = new HttpError(
      "Shift with the given ID could not be found.",
      404
    );
    return next(error);
  }

  res.status(200).json({ message: `Deleted place with ID ${shiftId}` });
};

exports.getShiftsByUserId = getShiftsByUserId;
exports.getShiftById = getShiftById;
exports.createShift = createShift;
exports.updateShift = updateShift;
exports.deleteShift = deleteShift;
