const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const asyncHandler = require("express-async-handler"); // Handles async errors gracefully

const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const Team = require("../models/Team");
const Project = require("../models/ProjectBank");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"));
    }
  },
});

// 📥 Fetch all projects from Project Bank
router.get(
  "/project-bank",
  asyncHandler(async (req, res) => {
    const projects = await Project.find();
    res.status(200).json(projects);
  })
);

// 📤 Upload CSV/Excel File
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { type } = req.body;
    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const collectionMap = {
      student: Student,
      mentor: Mentor,
      team: Team,
    };

    const Model = collectionMap[type];
    if (!Model) {
      return res.status(400).json({ error: "Invalid data type provided" });
    }
    // Verify the format of the uploaded file
    const requiredFields = Object.keys(Model.schema.paths).filter(
      (field) => field !== "_id" && field !== "__v"
    );

    const isValidFormat = data.every((row) =>
      requiredFields.every((field) => field in row)
    );

    if (!isValidFormat) {
      return res.status(400).json({
      error: "Invalid file format. Please ensure the file contains all required fields.",
      });
    }

    // Insert data into the database
    await Model.insertMany(data);
    res.status(200).json({ message: `${type} data uploaded successfully.` });
  })
);

// 🗑️ Flush data from a specific collection
router.delete(
  "/flush/:type",
  asyncHandler(async (req, res) => {
    const { type } = req.params;

    const collectionMap = {
      student: Student,
      mentor: Mentor,
      team: Team,
    };

    const Model = collectionMap[type];
    if (!Model) {
      return res.status(400).json({ error: "Invalid collection type" });
    }

    await Model.deleteMany({});
    res
      .status(200)
      .json({ message: `${type} collection deleted successfully.` });
  })
);

// 🗑️ Flush all collections
router.delete(
  "/flush-all",
  asyncHandler(async (req, res) => {
    await Promise.all([
      Student.deleteMany({}),
      Mentor.deleteMany({}),
      Team.deleteMany({}),
    ]);

    res.status(200).json({ message: "All collections deleted successfully." });
  })
);

// 🌍 Global Error Handler Middleware
router.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message || "An unexpected error occurred",
  });
});

module.exports = router;
