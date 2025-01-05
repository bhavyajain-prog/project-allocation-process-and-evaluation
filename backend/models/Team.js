const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Project Schema
const projectSchema = new Schema({
  name: { required: true, type: String },
  description: { required: true, type: String },
  techStack: { required: true, type: String },
});

// Team Schema
const teamSchema = new Schema(
  {
    code: { required: true, type: String, unique: true },
    // Leader Details
    leader: {
      name: { required: true, type: String },
      email: { required: true, type: String },
      phone: { required: true, type: String },
      rollNumber: { required: true, type: String },
    },
    // Batch
    batch: { required: true, type: String },
    // Team Members
    members: [
      {
        name: { required: true, type: String },
        rollNumber: { required: true, type: String },
      },
    ],
    // Project Details
    projectChoices: [projectSchema],
    confirmedProject: { type: projectSchema, default: null },
    // Mentor Choices
    mentorChoices: [{ type: String, required: true }],
    currentChoiceIndex: { type: Number, default: 0 },
    confirmedMentor: { type: String, default: null },
    requiresAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Models
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
