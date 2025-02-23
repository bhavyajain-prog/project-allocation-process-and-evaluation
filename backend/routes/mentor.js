const express = require("express");

const Mentor = require("../models/mentor");

const verifyRole = require("../middleware/verifyRole");
const router = express.Router();

// Will be used to list all the mentors as well as to be used as dropdown
// TODO: May be make another route to only get names with the id or email for the dropdowns as selections
router.get("/all", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (error) {
    res.json({ message: error });
  }
});

// Don't know when to use this
router.get("/:id", async (req, res) => {
  try {
    verifyRole(req, res, "admin");
    const mentor = await Mentor.findOne({ email: req.params.id });
    res.status(200).json({ mentor });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/choices", async (req, res) => {
  try {
    verifyRole(req, res, "student");
    const mentors = await Mentor.find({}, { _id: 1, name: 1, email: 1 });
    res.status(200).json(mentors);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
