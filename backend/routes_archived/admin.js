const express = require("express");
const Team = require("../models/Team");
const Mentor = require("../models/Mentor");

const router = express.Router();

router.get("/all-teams", async (_, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all-teams-left", async (_, res) => {
  try {
    const teams = await Team.find({ requiresAdmin: true });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/accept-team/:teamCode", async (req, res) => {
  try {
    const teamCode = req.params.teamCode;
    const team = await Team.findOne({ code: teamCode });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    team.requiresAdmin = false;
    await team.save();
    return res.status(200).json({ message: "Team approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/reject-team/:teamCode", async (req, res) => {
  try {
    const teamCode = req.params.teamCode;
    const feedback = req.body.feedback;
    const team = await Team.findOne({ code: teamCode });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    team.feedback = feedback;
    await team.save();
    return res.status(200).json({ message: "Feedback sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/available-mentors", async (_, res) => {
  try {
    const mentors = await Mentor.find({ teams: { $lt: 3 } });
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/allocate-mentor/:teamCode", async (req, res) => {
  try {
    const teamCode = req.params.teamCode;
    const mentorName = req.body.mentorName;
    const team = await Team.findOne({ code: teamCode });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    team.confirmedMentor = mentorName;
    await team.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
