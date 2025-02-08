const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Team = require("../models/Team");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Utility function for token validation
const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id, { name: 1 }); // Limit to required fields
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Process CSV and insert mentors
const processMentorCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const mentors = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        mentors.push({
          empNo: row["Emp No"],
          name: row["Name"],
          department: row["Department"],
          designation: row["Designation"],
          qualifications: row["Qualifications"] || "",
        });
      })
      .on("end", async () => {
        try {
          await Mentor.insertMany(mentors);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (err) => reject(err));
  });
};

// Routes
router.get("/all", async (_, res) => {
  try {
    const mentors = await Mentor.find(
      {},
      {
        empNo: 1,
        name: 1,
        department: 1,
        designation: 1,
        qualifications: 1,
        _id: 0,
      }
    );
    res.status(200).json({ mentors });
  } catch (err) {
    res.status(500).json({ error: "Error fetching mentors: " + err.message });
  }
});

router.get("/name", async (_, res) => {
  try {
    const mentors = await Mentor.find({}, { name: 1, _id: 0 });
    res.status(200).json({ mentors });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching mentor names: " + err.message });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await processMentorCSV(req.file.path);
    fs.unlinkSync(req.file.path); // Remove the uploaded file after processing
    res.status(200).send("Mentor details uploaded successfully!");
  } catch (error) {
    res.status(500).send("Error processing mentor file: " + error.message);
  }
});

router.get("/teams", validateToken, async (req, res) => {
  try {
    const mentorName = req.user.name;
    const teams = await Team.find({
      confirmedMentor: null,
      requiresAdmin: false,
    });

    let filtered = teams.filter(
      (team) => mentorName === team.mentorChoices[team.currentChoiceIndex]
    );

    res.status(200).json({ teams: filtered });
  } catch (err) {
    res.status(500).json({ error: "Error fetching teams: " + err.message });
  }
});

router.post("/team/:teamcode/reject", validateToken, async (req, res) => {
  try {
    const mentorName = req.user.name;

    const [team] = await Team.find({ code: req.params.teamcode });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.mentorChoices[team.currentChoiceIndex] !== mentorName) {
      return res.status(403).json({ message: "You cannot reject this team." });
    }
    console.log("Condition 1");

    // Handle rejection
    if (team.currentChoiceIndex + 1 < team.mentorChoices.length) {
      team.currentChoiceIndex += 1;
    } else {
      team.requiresAdmin = true;
    }
    console.log("End!!");

    await team.save();
    res.status(200).json({ message: "Team rejected and processed further." });
  } catch (err) {
    res.status(500).json({ error: "Error rejecting team: " + err.message });
  }
});

router.post("/team/:teamcode/accept", validateToken, async (req, res) => {
  try {
    const mentorName = req.user.name;
    const [team] = await Team.find({ code: req.params.teamcode });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.mentorChoices[team.currentChoiceIndex] !== mentorName) {
      return res.status(403).json({ message: "You cannot accept this team." });
    }

    team.confirmedMentor = mentorName;
    await team.save();
    res.status(200).json({ message: "Team accepted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error accepting team: " + err.message });
  }
});

module.exports = router;
