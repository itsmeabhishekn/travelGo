const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
} = require("../controllers/booking.controller");
const { isAuthenticated, isUser } = require("../middlewares/auth");

router.post("/", isAuthenticated, isUser, createBooking);
router.get("/", isAuthenticated, isUser, getUserBookings);

module.exports = router;
