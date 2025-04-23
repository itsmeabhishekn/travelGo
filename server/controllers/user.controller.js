const User = require("../models/User.model");
const s3 = require("../config/aws");
const multer = require("multer");
const multerS3 = require("multer-s3");

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

// Configure multer to use S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `profile-photos/${req.user.id}-${Date.now()}-${
        file.originalname
      }`;
      cb(null, fileName);
    },
  }),
});

// Middleware for handling file uploads
exports.uploadProfilePictureMiddleware = upload.single("profilePicture");

// Upload profile picture to S3 and update user profile
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    // Update the user's profile with the S3 file URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.location }, // S3 file URL
      { new: true }
    ).select("-password");

    if (!user) throw new Error("User not found");
    res.json(user);
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(400).json({ error: err.message });
  }
};
