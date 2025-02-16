const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Project Schema
const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: String, required: true },
});

// Team Schema
const teamSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    // Leader Details
    leader: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      rollNumber: { type: String, required: true },
    },
    // Batch
    batch: { type: String, required: true },
    // Team Members
    members: [
      {
        name: { type: String, required: true },
        rollNumber: { type: String, required: true },
      },
    ],
    // Project Details
    projectChoices: [{ type: Schema.Types.ObjectId, ref: "Project" }], // Reference to projects
    confirmedProject: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    }, // Reference instead of embedding
    // Mentor Choices
    mentorChoices: [{ type: Schema.Types.ObjectId, ref: "Mentor" }], // Store references instead of plain strings
    currentChoiceIndex: { type: Number, default: 0 },
    confirmedMentor: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    }, // Store reference instead of a string
    requiresAdmin: { type: Boolean, default: true },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
