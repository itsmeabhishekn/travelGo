require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const authRoutes = require("./routes/auth.routes");

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Set dynamically from .env or hardcoded URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow sending cookies
};

app.use(cors(corsOptions));

require("./config/passport");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

// Handle 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
