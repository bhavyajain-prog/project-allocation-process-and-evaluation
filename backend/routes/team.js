const express = require("express");
const JWT = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Team = require("../models/Team");
const Mentor = require("../models/Mentor");
const router = express.Router();

const verifyRole = require("../middleware/verifyRole");

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

router.post("/create", async (req, res) => {
  try {
    const decoded = verifyRole(req, res, "student");
    // Leader details : name, email, phone, rollNumber, batch
    const user = await User.findById(decoded.id);
    const leader = await Student.findOne({ email: user.email });
    const { name, email, phone, rollNumber, batch } = leader;
    // Team details : code, members, projectChoices, mentorChoices
    const { code, members, projectChoices, mentorChoices } = req.body;
    const team = new Team({
      code,
      leader: { name, email, phone, rollNumber },
      batch,
      members,
      projectChoices,
      mentorChoices,
    });
    // Save the new created team
    await team.save();
    // Update the teamCode of the leader
    await Student.updateOne({ email: user.email }, { teamCode: code });
    res.status(201).json({ message: "Team created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/join", async (req, res) => {
  try {
    const decoded = verifyRole(req, res, "student");
    const { code } = req.body;
    // Get student
    const user = await User.findById(decoded.id);
    const student = await Student.findOne({ email: user.email });
    // If student is already in a team
    if (student && student.teamCode) {
      return res.status(400).json({ error: "you are already in a team" });
    }
    const team = await Team.findOne({ code });
    // Team is full?
    if (team.members.length >= 3) {
      return res.status(400).json({ error: "team is full" });
    }
    // Batch must be same
    if (student.batch !== team.batch) {
      return res
        .status(400)
        .json({ error: "All team members must be in same batch" });
    }
    // Add member to the team
    team.members.push({ name: student.name, rollNumber: student.rollNumber });
    await team.save();
    // update the student's team code
    student.teamCode = code;
    await student.save();
    res.status(200).json({ message: "Joined team successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const teams = await Team.find();
    res.status(200).json({ teams });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/my-team", async (req, res) => {
  try {
    const decoded = verifyRole(req, res, "student");
    // Get the details
    const user = await User.findById(decoded.id);
    const student = await Student.findOne({ email: user.email });
    if (!student.teamCode) {
      return res.status(400).json({ error: "Not in a team" });
    }
    // Get the team
    const team = await Team.findOne({ code: student.teamCode });
    res.status(200).json({ team });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/:code", async (req, res) => {
  try {
    verifyRole(req, res, "admin"); // TODO: OR mentor
    const code = req.params.code;
    const team = await Team.findOne({ code });
    res.status(200).json({ team });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.put("/approve", async (req, res) => {
  try {
    const token = req.cookies.token;
    const { code } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const team = await Team.findOne({ code });
    if (decoded.role === "admin") {
      team.requiresAdmin = false;
      await team.save();
    } else if (decoded.role === "mentor") {
      const user = await User.findById(decoded.id);
      const mentor = await Mentor.findOne({ email: user.email });
      if (team.mentorChoices[team.currentChoiceIndex] !== mentor) {
        return res.status(400).json({ error: "Invalid call to backend" });
      }
      // Update the team
      team.confirmedMentor = mentor;
      await team.save();
      // Update the mentor
      mentor.teams.push(team);
      await mentor.save();
      res.status(200).json({ message: "Approved successfully" });
    } else return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.put("/reject", async (req, res) => {
  try {
    const token = req.cookies.token;
    const { code } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const team = await Team.findOne({ code });
    if (decoded.role === "admin") {
      const { feedback } = req.body;
      team.feedback = feedback;
      team.requiresAdmin = true; // TODO: Check if this is needed
      await team.save();
    } else if (decoded.role === "mentor") {
      team.currentChoiceIndex++;
      await team.save();
      res.status(200).json({ message: "Rejected successfully" });
    } else return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/assign-mentor", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const { team, mentor } = req.body;
    // Check mentor is available, team is unallocated
    if (!mentor || !team) {
      return res.status(400).json({ error: "Invalid request" });
    }
    if (mentor.teams.length >= 3) {
      return res
        .status(400)
        .json({ error: "Mentor is already assigned to 3 teams" });
    }
    if (team.confirmedMentor) {
      return res.status(400).json({ error: "Team already has a mentor" });
    }
    // Assign mentor
    team.confirmedMentor = mentor;
    await team.save();
    // Update mentor
    mentor.teams.push(team);
    await mentor.save();
    res.status(200).json({ message: "Mentor assigned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/leftover", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const teams = await Team.find({ requiresAdmin: true });
    res.status(200).json({ teams });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/unallocated", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const teams = await Team.find({ confirmedMentor: null });
    res.status(200).json({ teams });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
