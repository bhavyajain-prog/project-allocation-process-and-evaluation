const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();

// const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS: " + origin));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: true, // Reflect request origin
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
