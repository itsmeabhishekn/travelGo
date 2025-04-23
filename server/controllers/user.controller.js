const User = require("../models/User.model");
const fs = require("fs");
const path = require("path");

// Fetch user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw new Error("User not found");
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    ).select("-password");
    if (!user) throw new Error("User not found");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    // Save the file path to the user's profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: `/uploads/profile-pictures/${req.file.filename}` },
      { new: true }
    ).select("-password");

    if (!user) throw new Error("User not found");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
