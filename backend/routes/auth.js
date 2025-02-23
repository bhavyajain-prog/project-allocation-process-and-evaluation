const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Please check your credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Incorrect password. Please try again." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "30d" : "1d",
    });

    // Set cookie with security best practices
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    });

    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "You have been logged out successfully." });
});

// Get user details route
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. Please log in first." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User details retrieved successfully.", user });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res
      .status(403)
      .json({ error: "Invalid or expired token. Please log in again." });
  }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const { user } = await User.find({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Please check your email." });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const mail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link",
      html: `
          <h2>Please click on the link below to reset your password</h2>
          <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>
        `,
    };
    await transporter.sendMail(mail);
    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Reset password route
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ error: "Password reset link has expired. Please try again." });
    }
    console.error("Reset password error:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

// Register route
router.post("/register", async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch {
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later" });
  }
});

module.exports = router;
