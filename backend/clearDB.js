const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Student = require("./models/Student");
const Mentor = require("./models/Mentor");

dotenv.config();
connectDB();

const clearAllData = async () => {
  try {
    await User.deleteMany({});
    console.log("All users deleted");

    await Student.deleteMany({});
    console.log("All students deleted");

    await Mentor.deleteMany({});
    console.log("All mentors deleted");

    process.exit();
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    process.exit(1);
  }
};

clearAllData();
