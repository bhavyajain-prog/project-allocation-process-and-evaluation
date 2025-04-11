const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const insertUsers = require("../utils/insertSpecialUsers");

const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Team = require("../models/Team");
const Project = require("../models/ProjectBank");
const User = require("../models/User");

const router = express.Router();

// Collection type map
const collectionMap = {
  student: Student,
  mentor: Mentor,
  team: Team,
  project: Project,
  user: User,
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    cb(
      allowedTypes.includes(file.mimetype)
        ? null
        : new Error("Only CSV and Excel files are allowed"),
      allowedTypes.includes(file.mimetype)
    );
  },
});

// 📥 GET: All Projects
router.get(
  "/project-bank",
  asyncHandler(async (_, res) => {
    const projects = await Project.find();
    res.status(200).json(projects);
  })
);

const defaultPassword = process.env.DEFAULT_PASS;
// 📤 POST: Upload Students/Mentors/Projects
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const Model = collectionMap[type];

    if (!Model) {
      return res.status(400).json({ error: "Invalid data type provided" });
    }

    const filePath = path.resolve(file.path);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("data extracted");

    // Get required fields
    const requiredFields = Object.entries(Model.schema.paths)
      .filter(([key, path]) => path.isRequired && !["_id", "__v"].includes(key))
      .map(([key]) => key);

    console.log(requiredFields);

    const isValid = data.every((row) =>
      requiredFields.every((field) => field in row)
    );

    console.log(isValid);

    if (!isValid) {
      return res.status(400).json({
        error:
          "Invalid file format. Please ensure the file contains all required fields.",
      });
    }
    console.log("Inserting data!");

    await Model.insertMany(data);

    if (type === "student" || type === "mentor") {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const userDocs = data.map((entry) => ({
        email: entry.email,
        password: hashedPassword,
        role: type,
        username: entry.email.split("@")[0],
        name: entry.name.toUpperCase(),
      }));

      await User.insertMany(userDocs);
    }

    fs.unlink(filePath, (err) => {
      if (err) console.error(err);
    });

    res.status(200).json({ message: `${type} data uploaded successfully.` });
  })
);

// 🗑️ DELETE: Flush single collection
router.delete(
  "/flush/:type",
  asyncHandler(async (req, res) => {
    const { type } = req.params;
    const Model = collectionMap[type];

    if (!Model) {
      return res.status(400).json({ error: "Invalid collection type" });
    }

    if (type === "user") {
      await User.deleteMany({ role: { $nin: ["dev", "admin"] } });
      await insertUsers();
    } else {
      await Model.deleteMany({});
    }

    res
      .status(200)
      .json({ message: `${type} collection deleted successfully.` });
  })
);

// 🗑️ DELETE: Flush all
router.delete(
  "/flush-all",
  asyncHandler(async (_, res) => {
    await Promise.all(
      ["student", "mentor", "team", "project"].map((key) =>
        collectionMap[key].deleteMany({})
      )
    );
    await User.deleteMany({ role: { $nin: ["dev", "admin"] } });
    await insertUsers();

    res.status(200).json({ message: "All collections deleted successfully." });
  })
);

// Manual Allocation of teams
router.post(
  "/allocate/:code/:mentorID",
  asyncHandler(async (req, res) => {
    const { code, mentorID } = req.params;
    const { user } = req.body;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const team = await Team.findOne({ code });
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }
    if (team.requiresAdmin) {
      return res.status(400).json({ message: "Approve the team first." });
    }
    if (team.confirmedMentor) {
      return res.status(400).json({ message: "Team already has a mentor" });
    }
    if (team.currentChoiceIndex !== -1) {
      team.populate("mentorChoices");
      return res.status(400).json({
        message: "Mentors aer yet to approve this team",
        mentors: team.mentorChoices,
        flag: team.currentChoiceIndex,
      });
    }
    const mentor = await Mentor.findById(mentorID);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found." });
    }
    if (mentor.teams.length >= 3) {
      return res
        .status(400)
        .json({ message: "Mentor can not have more then 3 teams." });
    }

    team.confirmedMentor = mentorID;
    mentor.teams.push(team.code);

    await team.save();

    res.status(200).json({ message: "Mentor allocated successfully!" });
  })
);

// 🌍 Global Error Handler
router.use((err, req, res, next) => {
  console.error("🚨 Error:", err.message);
  res
    .status(500)
    .json({ error: err.message || "An unexpected error occurred" });
});

module.exports = router;
