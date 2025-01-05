const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  empNo: { type: String, required: true }, // From "Emp No"
  name: { type: String, required: true }, // From "Name"
  department: { type: String, required: true }, // From "Department"
  designation: { type: String, required: true }, // From "Designation"
  qualifications: { type: String, default: "" }, // Will be added later
});

module.exports = mongoose.model("Mentor", MentorSchema);
