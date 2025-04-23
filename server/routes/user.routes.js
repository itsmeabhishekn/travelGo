const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} = require("../controllers/user.controller");
const multer = require("multer");

// multer for file uploads
const upload = multer({ dest: "uploads/profile-pictures/" });

// Routes
router.get("/me", isAuthenticated, getUserProfile);
router.put("/me", isAuthenticated, updateUserProfile);
router.post(
  "/me/profile-picture",
  isAuthenticated,
  upload.single("profilePicture"),
  uploadProfilePicture
); // Upload profile picture

module.exports = router;
