const express = require("express");
const JWT = require("jsonwebtoken");
const Team = require("../models/Team.js");
const User = require("../models/User.js");
const Student = require("../models/Student.js");

const router = express.Router();

router.get("/code", async (_, res) => {
  const generateTeamCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  let teamCode;
  let isUnique = false;

  while (!isUnique) {
    teamCode = generateTeamCode();
    const existingTeam = await Team.findOne({ code: teamCode });
    if (!existingTeam) {
      isUnique = true;
    }
  }
  res.status(200).json({ code: teamCode });
});

// Create Team
// TODO: Make it so that leader details can be accessed from cookies itself
router.post("/create", async (req, res) => {
  const { code, leader, batch, projectChoices, mentorChoices } = req.body;

  try {
    // Check if the team code is already in use
    const existingTeam = await Team.findOne({ code });
    if (existingTeam) {
      return res.status(400).json({ error: "Team code already in use" });
    }

    // Check if the leader is already in a team
    const student = await Student.findOne({ email: leader.email });
    if (student && student.teamCode) {
      return res.status(400).json({ error: "Leader is already in a team" });
    }

    // Create and save the team
    const team = new Team({
      code,
      leader,
      batch,
      projectChoices,
      mentorChoices,
    });
    await team.save();

    // Update Student database
    if (student) {
      student.teamCode = code;
      await student.save();
    } else {
      // Create a new student record if not found
      await Student.create({
        rollNumber: leader.rollNumber,
        name: leader.name,
        batch: batch,
        email: leader.email,
        phone: leader.phone,
        teamCode: code,
      });
    }

    res.status(200).json({ message: "Team created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

// Join Team
router.post("/join", async (req, res) => {
  const { code } = req.body;

  try {
    // Find the team by code
    const team = await Team.findOne({ code });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Verify token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Find the student in User db
    const user = await User.findById(decoded.id);
    const student = await Student.findOne({ email: user.email });
    if (student && student.teamCode) {
      return res.status(400).json({ error: "You are already in a team" });
    }

    // Check if the team is full
    if (team.members.length >= 3) {
      return res.status(400).json({ error: "Team is full" });
    }

    if (team.batch !== student.batch) {
      return res
        .status(400)
        .json({ error: "All team members must be of same batch" });
    }

    // Add the student to the team
    team.members.push({ name: student.name, rollNumber: student.rollNumber });
    await team.save();

    // Update the student's team code
    if (student) {
      student.teamCode = code;
      await student.save();
    } else {
      // Create a new student record if not found
      await Student.create({
        rollNumber: decoded.rollNumber,
        name: decoded.name,
        batch: decoded.batch,
        email: decoded.email,
        phone: decoded.phone,
        teamCode: code,
      });
    }

    res.status(200).json({ message: "Joined team successfully" });
  } catch (err) {
    console.error("Error joining team:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

// TODO: verify the route
router.post("/get-team", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const student = await Student.findOne({ email: decoded.email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const team = await Team.findOne({ code: student.teamCode });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ team });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});
// TODO: verify the route
router.post("/leave", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(decoded.id);

    const student = await Student.findOne({ email: user.email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const team = await Team.findOne({ code: student.teamCode });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Remove student from team
    team.members = team.members.filter(
      (member) => member.rollNumber !== student.rollNumber
    );
    await team.save();

    // Update student's teamCode
    student.teamCode = null;
    await student.save();

    res.status(200).json({ message: "Left team successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

// TODO: verify
router.get("/status", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const student = await Student.findOne({ email: decoded.email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const team = await Team.findOne({ code: student.teamCode });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check admin approval
    if (!team.adminApproval) {
      return res.status(403).json({ message: "Not approved by mentor yet" });
    }

    // If a mentor is confirmed (not null), return the confirmed mentor's name
    if (team.confirmedMentor !== null) {
      return res.json({ confirmedMentor: team.confirmedMentor });
    }

    // If no mentor is confirmed, return available choices and current choice
    return res.json({
      mentorChoices: team.mentorChoices || [],
      currentChoiceIndex: team.currentChoiceIndex || 0,
    });

  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});


module.exports = router;
