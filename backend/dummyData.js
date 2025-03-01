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

const results = [];
const defaultPassword = "SKIT@123";
// Adding the dev user:-
const dev = {
  username: "nerfex",
  password: "@#$12345678",
  email: "jainbhavya2306@gmail.com",
  role: "dev",
  name: "Developer",
};
// Addint the admin user
const admin = {
  username: "admin",
  password: "admin123",
  email: "erp@skit.ac.in",
  role: "admin",
  name: "Admin",
};

// fs.createReadStream(path.join(__dirname, "../dummyData/students.csv"))
fs.createReadStream(path.join(__dirname, "../dummyData/teachers.csv"))
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    try {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await Mentor.insertMany(results);
      console.log("Mentor data inserted successfully");
      const mentors = await Mentor.find();
      const users = mentors.map((mentor) => {
        return {
          email: mentor.email,
          password: hashedPassword,
          role: "mentor",
          username: mentor.email.split("@")[0],
          name: mentor.name.toUpperCase(),
        };
      });
      await User.insertMany(users);
      console.log("User data inserted successfully");

      await Student.insertMany(results);
      console.log("Student data inserted successfully");
      const students = await Student.find();
      const users2 = students.map((student) => {
        return {
          email: student.email,
          password: hashedPassword,
          role: "student",
          username: student.email.split("@")[0],
          name: student.name.toUpperCase(),
        };
      });
      await User.insertMany(users2);
      console.log("User data inserted successfully");

      await User.create(dev);
      console.log("Dev data inserted successfully");

      await User.create(admin);
      console.log("Admin data inserted successfully");
      process.exit();
    } catch (error) {
      console.error("Error inserting data:", error);
      process.exit(1);
    }
  });

// Project Bank -- later csv
// Student data -- csv
// User data -- csv
// Mentor data -- csv
// Team data -- frontend
// Evaluation data -- later frontend
