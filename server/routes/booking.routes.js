const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
} = require("../controllers/booking.controller");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/", isAuthenticated, createBooking);
router.get("/", isAuthenticated, getUserBookings);

module.exports = router;
