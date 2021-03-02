const mongoose = require("mongoose");

const { Schema } = mongoose;

const shiftSchema = new Schema({
  datetime: { type: Date, default: Date.now, required: true },
  employeeId: { type: Number, required: true },
});

module.exports = mongoose.model("Shift", shiftSchema);
