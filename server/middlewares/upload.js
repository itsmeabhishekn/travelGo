const multer = require("multer");
const path = require("path");

// Set up the storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures"); // where the file will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // file naming convention
  },
});

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

// Create the multer instance
const multerInstance = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Export the multer instance
module.exports = multerInstance;
