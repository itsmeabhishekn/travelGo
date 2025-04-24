const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated } = require("../middlewares/auth");
const {
  getUsersAndBookings,
  getPackageStatus,
  getBookingCountPerPackage,
} = require("../controllers/analytics.controller");

// Admin-only routes
router.get("/users-bookings", isAuthenticated, isAdmin, getUsersAndBookings);
router.get("/package-status", isAuthenticated, isAdmin, getPackageStatus);
router.get(
  "/booking-count",
  isAuthenticated,
  isAdmin,
  getBookingCountPerPackage
);

module.exports = router;
