require("dotenv").config(); // This MUST come first
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Initialize Passport (must come after dotenv config)
require("./config/passport");

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
