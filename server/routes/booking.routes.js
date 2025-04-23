const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/booking.controller");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/", isAuthenticated, createBooking);

module.exports = router;
