const express = require("express");
const router = express.Router();
const { isAuthenticated, isUser } = require("../middlewares/auth");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  uploadProfilePictureMiddleware,
} = require("../controllers/user.controller");
const upload = require("../middlewares/upload"); // Importing the multer instance

// Routes
router.get("/profile", isAuthenticated, isUser, getUserProfile);
router.put("/profile", isAuthenticated, isUser, updateUserProfile);

// Upload profile picture
router.post(
  "/profile-picture",
  isAuthenticated,
  isUser,
  uploadProfilePictureMiddleware,
  uploadProfilePicture
);

module.exports = router;
