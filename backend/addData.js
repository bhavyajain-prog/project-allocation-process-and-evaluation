const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Student = require("./models/Student");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/projectAllocationSystem")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

(async () => {
  try {
    // Fetch all students
    const students = await Student.find();

    const users = [];

    for (const student of students) {
      // Adjust phone number if it's unavailable or invalid
      const phone =
        student.phone && student.phone !== "9999999999"
          ? student.phone
          : "0000000000"; // Default phone number

      // Generate username (e.g., rollNumber as username)
      const username = student.rollNumber;

      // Check if user already exists by email or username
      const existingUser = await User.findOne({
        $or: [{ email: student.email }, { username }],
      });
      if (existingUser) {
        console.log(
          `User for student ${student.name} already exists. Skipping.`
        );
        continue;
      }

      // Create new user
      const newUser = new User({
        name: student.name,
        email: student.email,
        phone,
        username,
        password: await bcrypt.hash("test123", 10), // Hash the default password
        role: "student", // Default role
      });

      users.push(newUser);
    }

    // Save all users in bulk
    if (users.length > 0) {
      await User.insertMany(users);
      console.log(`${users.length} users added successfully.`);
    } else {
      console.log("No new users to add.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
})();
