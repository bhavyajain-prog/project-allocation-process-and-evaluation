const express = require("express");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const mailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.get("/user", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ role: "" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.role) {
      return res.status(200).json({ role: "" });
    }

    res.status(200).json({ role: decoded.role });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res
      .status(500)
      .json({ error: "Server Error! Please try again later." });
  }
});
router.post("/login", async (req, res) => {
  const { username, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Invalid Credentials", status: "fail" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(200)
        .json({ message: "Invalid Credentials", status: "fail" });
    }
    const token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
      token,
      role: user.role,
      status: "success",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Server Error! Please try again later" });
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});
router.post("/register", async (req, res) => {
  const { name, username, password, role, email, phone } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(200).json({
        message: "User with this username or email already exists",
        registered: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      phone,
    });
    await newUser.save();
    const token = JWT.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      message: "User registered successfully",
      token,
      role: newUser.role,
      registered: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error! Please try again later" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }
    const resetToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
                <p>Hi ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: "Server Error! Please try again later" });
  }
});
// TODO: Verify the route for reset-password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Reset token has expired" });
    }
    res.status(500).json({ error: "Server Error! Please try again later" });
  }
});

module.exports = router;
