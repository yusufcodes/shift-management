const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: "String", required: true },
  // unique is to do with indexing the db. NOT checking if email exists
  email: { type: "String", required: true, unique: true },
  password: { type: "String", required: true, minlength: 6 },
  shifts: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
