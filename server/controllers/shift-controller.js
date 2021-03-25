const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Shift = require("../models/shift");
const User = require("../models/user");

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

const getCurrentShifts = async (req, res, next) => {
  console.log("Running getCurrentShifts...");
  // TODO: check this actually returns what I expect
  // console.log(req);

  const employeeId = req.userData.userId;

  if (!employeeId) {
    const error = new HttpError(
      "No user ID retrieved - make sure you are logged in!",
      500
    );
    return next(error);
  }

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
  console.log("Running createShift");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const { starttime, endtime, employeeId } = req.body;
  console.log(starttime, endtime, employeeId);

  // TODO: Once I create Date selection on front end, pass this in here - currently just uses current date.
  const createdShift = new Shift({
    starttime,
    endtime,
    employeeId,
  });

  let user;

  // Find the user first before updating their shift
  try {
    user = await User.findById(employeeId);
  } catch (err) {
    const error = new HttpError("Creating shift failed", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user with given ID", 404);
    return next(error);
  }
  /*
  - Run multiple operations independently but if one fails, undo all operations.
    - Sessions: Start a session, initiate the transaction, and once the transaction is successful,
  only then do we finish the session.
  - Transactions: Performs multiple operations
  */
  // Transactions: session -> initiate transaction -> successful, finish session
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // 1. Store the created shift
    await createdShift.save({ session: sess });
    // 2. Link the created shift to the corresponding user
    user.shifts.push(createdShift); // Push: Mongoose method, establish link between Shift and User
    await user.save({ session: sess });

    // Save the data that has just been changed - only saved when this line is executed
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating shift failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ shift: createdShift });
};

// PATCH: Update fields of any Shift
const updateShift = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, please check your data", 422);
  }

  const shiftId = mongoose.Types.ObjectId(req.params.sid);
  const { starttime, endtime } = req.body;

  let updatedShift;

  try {
    // Each param: Item to update, fields to update, return the newly updated data
    updatedShift = await Shift.findOneAndUpdate(
      { _id: shiftId },
      { starttime: starttime, endtime: endtime },
      { new: true }
    );
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
  console.log("Shift ID to be removed: ");
  console.log(shiftId);

  let shift;

  try {
    /* Populate: only works if there is a link between two models (Shift and User in this case)
     */
    // Returns the Shift properties along with the User it belongs to.
    shift = await Shift.findById(shiftId).populate("employeeId");
  } catch (err) {
    const error = new HttpError(
      "Server: Something went wrong, could not find shift.",
      500
    );
    return next(error);
  }

  if (!shift) {
    const error = new HttpError("Could not find a shift for this ID", 404);
    return next(error);
  }

  // Removing the shift + removing it from the associated employeeId
  try {
    // Start a new session
    const sess = await mongoose.startSession();
    // Start an associated transaction
    sess.startTransaction();

    // 1. Remove the shift
    await shift.remove({ session: sess });

    // 2. Remove the shift from the employeeId
    shift.employeeId.shifts.pull(shift); // ID removed by pull

    // employeeId: full employeeId object linked to the shift we are removing.
    await shift.employeeId.save({ session: sess });

    // Save the data that has just been changed - only saved when this line is executed
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Could not delete place", 500);
    return next(error);
  }

  res.status(200).json({ message: `Deleted shift with ID ${shiftId}` });
};

exports.getShiftsByUserId = getShiftsByUserId;
exports.getShiftById = getShiftById;
exports.getCurrentShifts = getCurrentShifts;
exports.createShift = createShift;
exports.updateShift = updateShift;
exports.deleteShift = deleteShift;
