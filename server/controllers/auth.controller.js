const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { createToken } = require("../config/jwt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await User.create({ email, password, role });

    const token = createToken(newUser._id);

    res.status(201).json({
      token,
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creating user: " + err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = createToken(user._id);

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

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

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential" });
    }

    // Verify the Google credential
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account has no email" });
    }

    // Check if the user exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = await User.create({
        email,
        googleId,
        name,
        profilePicture: picture,
        role: "user",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
};

exports.checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    res.status(200).json({ message: "User is authenticated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during authentication check" });
  }
};
