const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
let SHIFTS = [
  {
    id: "1",
    employeeId: "1",
    date: "Tuesday 8th February 2021",
    time: "16:00 - 22:00",
  },
];

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

const getShiftByUserId = ({ params }, res, next) => {
  const userId = params.uid;
  const user = SHIFTS.find((s) => s.employeeId === userId);
  if (!user) {
    throw new HttpError("Could not find a shift for the provided user ID", 404);
  }
  console.log("GET request in shift for a user");
  res.json({ user }); // Any data type that can be converted to JSON, returns it upon request
  // place: place
};

const createShift = (req, res, next) => {
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

const updateShift = ({ body, params }, res, next) => {
  const { date, time } = body;
  const shiftId = params.sid;

  // Create a copy of the shift, so that original data is not directly manipulated
  // Spread operator used to create the copy
  const updatedShift = { ...SHIFTS.find((s) => s.id === shiftId) };
  const shiftIndex = SHIFTS.findIndex((s) => s.id === shiftId);

  updatedShift.date = date;
  updatedShift.time = time;

  SHIFTS[shiftIndex] = updatedShift;

  res.status(200).json({ shift: updatedShift });
};

const deleteShift = (req, res, next) => {
  const shiftId = req.params.sid;

  // Filter out the shift to be deleted from the array
  SHIFTS = SHIFTS.filter((p) => p.id !== shiftId);
  res.status(200).json({ message: `Deleted place with ID ${shiftId}` });
};

exports.getShiftByUserId = getShiftByUserId;
exports.getShiftById = getShiftById;
exports.createShift = createShift;
exports.updateShift = updateShift;
exports.deleteShift = deleteShift;
