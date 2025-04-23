const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/auth");
const {
  getUsersAndBookings,
  getPackageStatus,
  getBookingCountPerPackage,
} = require("../controllers/analytics.controller");

// Admin-only routes
router.get("/users-bookings", isAdmin, getUsersAndBookings);
router.get("/package-status", isAdmin, getPackageStatus);
router.get("/booking-count", isAdmin, getBookingCountPerPackage);

module.exports = router;
