const express = require("express");
const JWT = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Team = require("../models/Team");
const Mentor = require("../models/Mentor");

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
router.post("/create", async (req, res) => {
  try {
    const { code, projectChoices, mentorChoices, user } = req.body;
    const leader = await Student.findOne({ email: user.email });

    const team = new Team({
      code,
      leader: leader._id,
      batch: leader.batch,
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
router.post("/join", async (req, res) => {
  try {
    const { code, user } = req.body;
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

    team.members.push(student._id);
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

router.post("/leave", async (req, res) => {
  try {
    const { user } = req.body;
    const student = await Student.findOne({ email: user.email });

    if (!student) {
      return res.status(404).json({ message: "Student not found!" });
    }

    if (!student.teamCode) {
      return res.status(404).json({ message: "User not in a team!" });
    }

    const team = await Team.findOne({ code: student.teamCode });

    if (!team) {
      return res.status(404).json({ message: "Team not found!" });
    }

    if (team.leader.equals(student._id)) {
      return res.status(401).json({
        error: "Forbidden",
        message: "You are the leader. Contact admin for more.",
      });
    }

    team.members = team.members.filter(
      (memberId) => !memberId.equals(student._id)
    );
    await team.save();

    student.teamCode = null;
    await student.save();

    return res.status(200).json({ message: "Successfully left the team." });
  } catch (err) {
    console.error("Error in /leave route:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔍 Get all teams (Admin only)
router.get("/all", async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ teams });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/left-for-review", async (req, res) => {
  try {
    const user = JSON.parse(req.headers["x-user"]);

    if (user.role && user.role === "admin") {
      const teams = await Team.find({ requiresAdmin: true })
        .populate("leader")
        .populate("members")
        .populate("mentorChoices");
      res.status(200).json({ teams });
    } else if (user.role && user.role === "mentor") {
      const mentor = await Mentor.findOne({ email: user.email });
      const teams = await Team.find({
        requiresAdmin: false,
        confirmedMentor: null,
      })
        .populate("leader")
        .populate("members")
        .populate("mentorChoices");
      console.log(teams);

      const filteredTeams = teams.filter((team) => {
        const currentChoice = team.mentorChoices[team.currentChoiceIndex];
        return currentChoice && currentChoice._id.equals(mentor._id);
      });
      res.status(200).json({ teams: filteredTeams });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/left-over-teams", async (req, res) => {
  const teams = await Team.find({ currentChoiceIndex: -1 })
    .populate("members")
    .populate("leader")
    .populate("mentorChoices");
  res.status(200).json({ teams });
});

// 🧑‍🤝‍🧑 Get current user's team details (Students only)
router.get("/my-team", async (req, res) => {
  try {
    const { email } = req.headers;
    const student = await Student.findOne({ email });

    if (!student || !student.teamCode) {
      return res.status(400).json({ error: "You are not in a team" });
    }

    const team = await Team.findOne({ code: student.teamCode })
      .populate("leader")
      .populate("members")
      .populate("mentorChoices")
      .populate("confirmedMentor");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const membersSet = new Map();

    // Add members
    team.members.forEach((member) => {
      membersSet.set(member._id.toString(), {
        name: member.name,
        email: member.email,
        rollNumber: member.rollNumber,
      });
    });

    // Add or update leader (with (L) suffix)
    membersSet.set(team.leader._id.toString(), {
      name: `${team.leader.name} (L)`,
      email: team.leader.email,
      rollNumber: team.leader.rollNumber,
    });

    // Convert map values to array
    const membersData = Array.from(membersSet.values());

    res.status(200).json({
      members: membersData,
      code: team.code,
      admin: team.requiresAdmin,
      mentors: team.mentorChoices,
      choice: team.currentChoiceIndex,
      confirmed: team.confirmedMentor,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 🔍 Get a team by code (Admin or Mentor)
router.get("/code/:code", async (req, res) => {
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
    const { code, user, feedback } = req.body;

    if (!user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const team = await Team.findOne({ code });

    if (!team) return res.status(404).json({ error: "Team not found" });

    if (user.role === "admin") {
      team.requiresAdmin = false;
      team.feedback.admin = feedback;
      await team.save();
      return res.status(200).json({ message: "Approved by Admin" });
    } else if (user.role === "mentor") {
      const mentor = await Mentor.findOne({ email: user.email });
      // console.log(mentor._id);
      // console.log(team.mentorChoices[team.currentChoiceIndex]);

      if (!team.mentorChoices[team.currentChoiceIndex].equals(mentor._id)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (mentor.teams.length >= 3) {
        return res.status(400).json({
          error: "Mentor limit reached",
          message: "You can only mentor up to 3 teams.",
        });
      }

      team.confirmedMentor = mentor._id;
      team.feedback.mentor = feedback;
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

router.put("/reject", async (req, res) => {
  try {
    const { code, user, feedback } = req.body;

    if (!user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const team = await Team.findOne({ code });
    if (!team) return res.status(404).json({ error: "Team not found" });

    if (user.role === "admin") {
      team.feedback.admin = feedback;
      await team.save();
      return res.status(200).json({ message: "Rejected by Admin" });
    } else if (user.role === "mentor") {
      const mentor = await Mentor.findOne({ email: user.email });
      if (!mentor) return res.status(404).json({ error: "Mentor not found" });

      const currentMentorId = team.mentorChoices[team.currentChoiceIndex];
      if (!mentor._id.equals(currentMentorId)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Move to next mentor choice only if available
      if (team.currentChoiceIndex < team.mentorChoices.length - 1) {
        team.currentChoiceIndex++;
      } else {
        team.currentChoiceIndex = -1;
      }
      team.feedback.mentor = feedback;
      await team.save();
      return res.status(200).json({ message: "Rejected by Mentor" });
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
