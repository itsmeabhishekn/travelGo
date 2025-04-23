const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { createToken } = require("../config/jwt");

exports.signup = async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ email, password, role });

    // Generate JWT Token
    const token = createToken(newUser._id);

    // Send response with token and user data
    res.status(201).json({
      token,
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ error: "Error creating user: " + err.message });
  }
};

// Email/Password Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and select password for comparison
    const user = await User.findOne({ email }).select("+password");

    // Validate user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = createToken(user._id);

    // Send response with token and user data
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error during login" });
  }
};

// New admin login controller
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check for admin role
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const token = createToken(user._id);

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error during admin login" });
  }
};

exports.googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(400)
        .json({ error: "User not found after Google authentication" });
    }

    // Generate JWT Token
    const token = createToken(user._id);

    // Send response with token and user data
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error during Google OAuth" });
  }
};

// Endpoint for checking if user is authenticated
exports.checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    res.status(200).json({ message: "User is authenticated" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error during authentication check" });
  }
};
