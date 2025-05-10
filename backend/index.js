const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const insertUsers = require("./utils/insertSpecialUsers");

dotenv.config();
connectDB().then(() => {
  insertUsers();
});

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const auth = require("./routes/auth");
const team = require("./routes/team");
const mentor = require("./routes/mentor");
const student = require("./routes/student");
const admin = require("./routes/admin");

app.use("/auth", auth);
app.use("/team", team);
app.use("/mentor", mentor);
app.use("/student", student);
app.use("/admin", admin);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});