const express = require("express");
const Student = require("../models/Student");
const Team = require("../models/Team");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

// 📋 Get all students (Admin only)
router.get("/all", verifyRole("admin"), async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students", details: error.message });
  }
});

// 🔍 Get specific student by roll number (Admin only)
router.get("/:rollNumber", verifyRole("admin"), async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student", details: error.message });
  }
});

// 👥 Get student's team details (Admin only)
router.get("/team/:rollNumber", verifyRole("admin"), async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!student.teamCode || student.teamCode.trim() === "") {
      return res.status(404).json({ error: "Student is not part of any team" });
    }

    const team = await Team.findOne({ code: student.teamCode })
      .populate("confirmedMentor", "name email") // Only return necessary fields
      .populate("projectChoices", "title description")
      .populate("confirmedProject", "title description");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team details", details: error.message });
  }
});

module.exports = router;
