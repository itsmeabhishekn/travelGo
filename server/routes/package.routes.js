const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const {
  createPackage,
  updatePackage,
  deletePackage,
  listPackages,
  getPackageById,
} = require("../controllers/package.controller");

// Admin-only routes
router.post("/", isAuthenticated, isAdmin, createPackage);
router.put("/:id", isAuthenticated, isAdmin, updatePackage);
router.delete("/:id", isAuthenticated, isAdmin, deletePackage);

// Public routes
router.get("/", listPackages);
router.get("/:id", getPackageById);

module.exports = router;
