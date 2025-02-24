const express = require("express");
const Student = require("../models/Student");
const Team = require("../models/Team");
// const Eval = require("../models/Evaluation");

const verifyRole = require("../middleware/verifyRole");
const router = express.Router();

// Get all students
router.get("/all", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching students", details: error.message });
  }
});

// Get specific student by roll number
router.get("/:id", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const student = await Student.findOne({ rollNumber: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching student", details: error.message });
  }
});

// Get student's team details
router.get("/team/:id", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const student = await Student.findOne({ rollNumber: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    if (!student.teamCode || student.teamCode.trim() === "") {
      return res.status(404).json({ error: "Student is not in a team" });
    }

    const team = await Team.findOne({ code: student.teamCode })
      .populate("confirmedMentor")
      .populate("projectChoices")
      .populate("confirmedProject");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching student's team", details: error.message });
  }
});

module.exports = router;
