const express = require("express");
const multer = require("multer");

const Project = require("../models/Project");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/project-bank", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Example: Detect which collection to insert data into
    if (req.body.type === "student") {
      await Student.insertMany(data);
    } else if (req.body.type === "mentor") {
      await Mentor.insertMany(data);
    } else if (req.body.type === "team") {
      await Team.insertMany(data);
    } else {
      return res.status(400).json({ error: "Invalid data type provided" });
    }

    res
      .status(200)
      .json({ message: "File processed and data stored successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "File processing failed", details: error.message });
  }
});

// Flush all data from a specific collection
router.delete("/flush/:type", async (req, res) => {
  try {
    const { type } = req.params;

    if (type === "student") {
      await Student.deleteMany({});
    } else if (type === "mentor") {
      await Mentor.deleteMany({});
    } else if (type === "team") {
      await Team.deleteMany({});
    } else {
      return res.status(400).json({ error: "Invalid collection type" });
    }

    res
      .status(200)
      .json({ message: `${type} collection deleted successfully.` });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete data", details: error.message });
  }
});

// Flush all collections
router.delete("/flush-all", async (req, res) => {
  try {
    await Promise.all([
      Student.deleteMany({}),
      Mentor.deleteMany({}),
      Team.deleteMany({}),
    ]);

    res.status(200).json({ message: "All data deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete the data", details: error.message });
  }
});
