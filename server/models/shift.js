const mongoose = require("mongoose");

const { Schema } = mongoose;

const shiftSchema = new Schema({
  starttime: { type: Date, default: Date.now, required: true },
  endtime: { type: Date, default: Date.now, required: true },
  employeeId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Shift", shiftSchema);
