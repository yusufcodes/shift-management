const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: "string", required: true },
  // unique is to do with indexing the db. NOT checking if email exists
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true, minlength: 6 },
  admin: { type: "Boolean", required: true },
  shifts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Shift" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
