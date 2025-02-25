const express = require("express");
const Mentor = require("../models/Mentor");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

// 🔍 Get all mentors (for admin use or general listing)
router.get("/all", verifyRole("admin"), async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch mentors", details: error.message });
  }
});

// 🔍 Get a specific mentor by email (for admin use)
router.get("/:email", verifyRole("admin"), async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ email: req.params.email });
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    res.status(200).json({ mentor });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 🔽 Get mentor choices for dropdown (only ID, name, and email) (for student use)
router.get("/choices", verifyRole("student"), async (req, res) => {
  try {
    const mentors = await Mentor.find({}, { _id: 1, name: 1, email: 1 });
    res.status(200).json(mentors);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch mentor choices",
        details: error.message,
      });
  }
});

module.exports = router;
