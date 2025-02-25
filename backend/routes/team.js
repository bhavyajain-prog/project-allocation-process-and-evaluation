const express = require("express");
const JWT = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Team = require("../models/Team");
const Mentor = require("../models/Mentor");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

// 🔑 Generate a unique team code
router.get("/code", async (_, res) => {
  const generateTeamCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  let teamCode;
  while (true) {
    teamCode = generateTeamCode();
    const existingTeam = await Team.findOne({ code: teamCode });
    if (!existingTeam) break;
  }

  res.status(200).json({ code: teamCode });
});

// 🏗️ Create a new team (Students only)
router.post("/create", verifyRole("student"), async (req, res) => {
  try {
    const decoded = req.user;
    const user = await User.findById(decoded.id);
    const leader = await Student.findOne({ email: user.email });

    const { code, members, projectChoices, mentorChoices } = req.body;

    const team = new Team({
      code,
      leader: {
        name: leader.name,
        email: leader.email,
        phone: leader.phone,
        rollNumber: leader.rollNumber,
      },
      batch: leader.batch,
      members,
      projectChoices,
      mentorChoices,
    });

    await team.save();
    await Student.updateOne({ email: user.email }, { teamCode: code });

    res.status(201).json({ message: "Team created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 🤝 Join an existing team (Students only)
router.post("/join", verifyRole("student"), async (req, res) => {
  try {
    const decoded = req.user;
    const { code } = req.body;

    const user = await User.findById(decoded.id);
    const student = await Student.findOne({ email: user.email });

    if (student.teamCode) {
      return res.status(400).json({ error: "You are already in a team" });
    }

    const team = await Team.findOne({ code });

    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.members.length >= 3)
      return res.status(400).json({ error: "Team is full" });
    if (student.batch !== team.batch)
      return res.status(400).json({ error: "Batch mismatch" });

    team.members.push({ name: student.name, rollNumber: student.rollNumber });
    await team.save();

    student.teamCode = code;
    await student.save();

    res.status(200).json({ message: "Joined team successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 🔍 Get all teams (Admin only)
router.get("/all", verifyRole("admin"), async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ teams });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 🧑‍🤝‍🧑 Get current user's team details (Students only)
router.get("/my-team", verifyRole("student"), async (req, res) => {
  try {
    const decoded = req.user;
    const user = await User.findById(decoded.id);
    const student = await Student.findOne({ email: user.email });

    if (!student.teamCode) {
      return res.status(400).json({ error: "You are not in a team" });
    }

    const team = await Team.findOne({ code: student.teamCode });
    res.status(200).json({ team });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 🔍 Get a team by code (Admin or Mentor)
router.get("/:code", verifyRole(["admin", "mentor"]), async (req, res) => {
  try {
    const team = await Team.findOne({ code: req.params.code });
    if (!team) return res.status(404).json({ error: "Team not found" });

    res.status(200).json({ team });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Approve team (Mentor or Admin)
router.put("/approve", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const { code } = req.body;

    const team = await Team.findOne({ code });
    if (!team) return res.status(404).json({ error: "Team not found" });

    if (decoded.role === "admin") {
      team.requiresAdmin = false;
      await team.save();
      return res.status(200).json({ message: "Approved by Admin" });
    } else if (decoded.role === "mentor") {
      const user = await User.findById(decoded.id);
      const mentor = await Mentor.findOne({ email: user.email });

      if (team.mentorChoices[team.currentChoiceIndex] !== mentor._id) {
        return res.status(400).json({ error: "Invalid mentor approval" });
      }

      team.confirmedMentor = mentor._id;
      await team.save();

      mentor.teams.push(team._id);
      await mentor.save();

      return res.status(200).json({ message: "Approved by Mentor" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
