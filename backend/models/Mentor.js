const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  empNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  qualifications: { type: String, default: "" },
  teams: [{ type: String }], // Stores team codes instead of a number
});

module.exports = mongoose.model("Mentor", MentorSchema);
