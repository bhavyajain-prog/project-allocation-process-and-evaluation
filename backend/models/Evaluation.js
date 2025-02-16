const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  weeklyScores: [{ week: Number, score: Number, feedback: String }], // Stores weekly evaluations
  finalScore: { type: Number, default: null },
  finalFeedback: { type: String, default: "" },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
