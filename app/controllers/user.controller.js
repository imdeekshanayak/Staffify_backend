const express = require("express");
const apiRoutes = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = "staffify_secret_key"; // move to .env in production
const otpStore = {};

module.exports = function (app) {

  apiRoutes.post("/register", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = "USR-" + Math.floor(1000 + Math.random() * 9000);

      const newUser = await User.create({
        userId,
        name,
        email,
        password: hashedPassword,
        role: role || "employee",
        isActive: true
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

  
  apiRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ compare hashed password properly
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

  apiRoutes.post("/forget-password", async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const otp = crypto.randomInt(100000, 999999);
      otpStore[email] = otp;

      console.log(`OTP for ${email}: ${otp}`);

      // In production → send email here

      return res.status(200).json({
        success: true,
        message: "OTP generated successfully"
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

  apiRoutes.post("/verify-otp", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (otpStore[email] !== parseInt(otp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP"
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      delete otpStore[email];

      return res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

  apiRoutes.post("/adminLogin", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin not found"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        { userId: user.userId, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

  app.use("/", apiRoutes);
};
