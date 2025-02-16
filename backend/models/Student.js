const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  batch: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  teamCode: { type: String, default: null }, // Using null for better checks
  mentorChoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    default: null,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
