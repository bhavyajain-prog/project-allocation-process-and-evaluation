const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  username: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  role: {
    type: String,
    enum: ["admin", "student", "mentor", "dev", "sub-admin"],
    required: true,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
