const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} = require("../controllers/user.controller");
const upload = require("../middlewares/upload"); // Importing the multer instance

// Routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);

// Upload profile picture
router.post(
  "/profile-picture",
  isAuthenticated,
  upload.single("profilePicture"), // Applying the .single() middleware
  uploadProfilePicture
);

module.exports = router;
