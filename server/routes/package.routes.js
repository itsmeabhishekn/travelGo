const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/auth");
const {
  createPackage,
  updatePackage,
  deletePackage,
  listPackages,
  getPackageById,
} = require("../controllers/package.controller");

// Admin-only routes
router.post("/", isAdmin, createPackage);
router.put("/:id", isAdmin, updatePackage);
router.delete("/:id", isAdmin, deletePackage);

// Public routes
router.get("/", listPackages);
router.get("/:id", getPackageById);

module.exports = router;
