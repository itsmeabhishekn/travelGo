const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  uploadProfilePictureMiddleware,
} = require("../controllers/user.controller");
const upload = require("../middlewares/upload"); // Importing the multer instance

// Routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);

// Upload profile picture
router.post(
  "/profile-picture",
  isAuthenticated,
  uploadProfilePictureMiddleware,
  uploadProfilePicture
);

module.exports = router;
