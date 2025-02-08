const mongoose = require("mongoose");
const User = require("./models/User");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      "mongodb://localhost:27017/projectAllocationSystem"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();


// UserDB
// 8 student users
// 1 dev user
// 1 admin user
// 5 mentor users

const users = [
  // dev
  {
    name: "NerfexDox",
    email: "jainbhavya2306@gmail.com",
    username: "nerfex",
    password: "nerff",
    role: "dev",
  },
  // admin
  {
    name: "admin",
    email: "admin@gmail.com",
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  // mentors
  {
    name: "Mahender Kumar Beniwal",
    email: "beniwalmahender@skit.ac.in",
    username: "mahender",
    password: "mahender123",
    role: "mentor",
  },
  {
    name: "Aakriti Sharma",
    email: "sharmaaakriti@skit.ac.in",
    username: "aakriti",
    password: "aakriti123",
    role: "mentor",
  },
  {
    name: "Mehul Mahrishi",
    email: "mahrishimehul@skit.ac.in",
    username: "mehul",
    password: "mehul123",
    role: "mentor",
  },
  {
    name: "Pratipal Singh",
    email: "singhpratipal@skit.ac.in",
    username: "pratipal",
    password: "pratipal123",
    role: "mentor",
  },
  {
    name: "Shanu Tripathi",
    email: "tripathishanu@skit.ac.in",
    username: "shanu",
    password: "shanu123",
    role: "mentor",
  },
  // students
  {
    name: "Bhavya Jain",
    email: "b230472@skit.ac.in",
    username: "b230472",
    password: "SKIT@123",
    role: "student",
  },
  {
    name: "Chitraksh Sharma",
    email: "B230793@skit.ac.in",
    username: "B230793",
    password: "SKIT@123",
    role: "student",
  },
  {
    name: "Devanshi Vijay",
    email: "B230822@skit.ac.in",
    username: "B230822",
    password: "SKIT@123",
    role: "student",
  },
  {
    name: "Antriksh Rawat",
    email: "B230941@skit.ac.in",
    username: "B230941",
    password: "SKIT@123",
    role: "student",
  },
  {
    name: "Akshat Lila",
    email: "B231449@skit.ac.in",
    username: "B231449",
    password: "SKIT@123",
    role: "student",
  },
  {
    name: "Charvi Gehija",
    email: "B231545@skit.ac.in",
    username: "B231545",
    password: "SKIT@123",
    role: "student",
  },
  {
    name: "Bhavya Chauthramani",
    email: "B231451@skit.ac.in",
    username: "B231451",
    password: "SKIT@123",
    role: "student",
  },
];

const addUsers = () => {
  users.forEach(async (user) => {
    try {
      const newUser = new User(user);
      await newUser.save();
      //   console.log("User added successfully");
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
};

addUsers();

// MentorDB
// via CSV

// TeamDB
// via frontend

// StudentDB
// via csv

// ProjectDB
// via csv
