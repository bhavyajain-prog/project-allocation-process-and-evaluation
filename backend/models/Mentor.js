const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  empNo: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  qualifications: { type: String, default: "" },
  teams: { type: Number, default: 0 },
});

module.exports = mongoose.model("Mentor", MentorSchema);
