const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Team Schema
const teamSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    // Leader Details
    leader: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    // Batch
    batch: { type: String, required: true },
    // Team Members
    members: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    // Project Details
    projectChoices: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        techStack: { type: String, required: true },
      },
    ],
    confirmedProject: {
      type: new Schema(
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
          techStack: { type: String, required: true },
        },
        { _id: false }
      ),
      default: null,
    },

    // Mentor Choices
    mentorChoices: [{ type: Schema.Types.ObjectId, ref: "Mentor" }], // Store references instead of plain strings
    currentChoiceIndex: { type: Number, default: 0 },
    confirmedMentor: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    }, // Store reference instead of a string
    requiresAdmin: { type: Boolean, default: true },
    feedback: {
      admin: { type: String, default: null },
      mentor: { type: String, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
