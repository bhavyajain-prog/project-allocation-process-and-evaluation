const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  phone: { type: String }, // TODO: Change back to required: true
  username: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  role: { required: true, type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
