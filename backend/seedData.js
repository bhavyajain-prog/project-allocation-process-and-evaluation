const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Student = require("./models/Student");
const Mentor = require("./models/Mentor");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");

dotenv.config();
connectDB();

const defaultPassword = "SKIT@123";

// Special users
const dev = {
  username: "nerfex",
  password: "@#$12345678",
  email: "jainbhavya2306@gmail.com",
  role: "dev",
  name: "Developer",
};
const admin = {
  username: "admin",
  password: "admin123",
  email: "erp@skit.ac.in",
  role: "admin",
  name: "Admin",
};

// Function to parse CSV
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

const seedData = async () => {
  try {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // === MENTORS ===
    const mentorData = await parseCSV(
      path.join(__dirname, "./dummyData/teachers.csv")
    );
    await Mentor.insertMany(mentorData);
    console.log("Mentor data inserted successfully");

    const mentorUsers = mentorData.map((mentor) => ({
      email: mentor.email,
      password: hashedPassword,
      role: "mentor",
      username: mentor.email.split("@")[0],
      name: mentor.name.toUpperCase(),
    }));
    await User.insertMany(mentorUsers);
    console.log("Mentor users inserted successfully");

    // === STUDENTS ===
    const studentData = await parseCSV(
      path.join(__dirname, "./dummyData/students.csv")
    );
    await Student.insertMany(studentData);
    console.log("Student data inserted successfully");

    const studentUsers = studentData.map((student) => ({
      email: student.email,
      password: hashedPassword,
      role: "student",
      username: student.email.split("@")[0],
      name: student.name.toUpperCase(),
    }));
    await User.insertMany(studentUsers);
    console.log("Student users inserted successfully");

    // === SPECIAL USERS ===
    await User.create(dev);
    console.log("Dev user inserted");

    await User.create(admin);
    console.log("Admin user inserted");

    process.exit();
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    process.exit(1);
  }
};

seedData();
