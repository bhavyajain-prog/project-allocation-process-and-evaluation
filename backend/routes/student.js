const csvParser = require("csv-parser");
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const Student = require("../models/Student");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const students = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        students.push({
          rollNumber: row["rollNumber"],
          name: row["name"],
          batch: row["batch"],
          email: row["email"],
          phone: row["phone"] || 9999999999,
        });
      })
      .on("end", async () => {
        try {
          await Student.insertMany(students);
          resolve();
        } catch (error) {
          resolve(error);
        }
      })
      .on("error", (err) => reject(err));
  });
};

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await processMentorCSV(req.file.path);
    fs.unlinkSync(req.file.path); // Remove the uploaded file after processing
    res.status(200).send("Mentor details uploaded successfully!");
  } catch (error) {
    res.status(500).send("Error processing mentor file: " + error.message);
  }
});

module.exports = router;
