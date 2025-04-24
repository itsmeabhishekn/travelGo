const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signup,
  login,
  checkAuth,
  adminLogin,
  googleLogin,
} = require("../controllers/auth.controller");

router.post("/google", googleLogin); //new one
// Email/Password Auth (Signup and Login)
router.post("/signup", signup); // Signup Endpoint
router.post("/login", login); // Login Endpoint
router.post("/admin/login", adminLogin); // Login Endpoint

// Endpoint to check if the user is authenticated (for frontend check)
router.get("/check-auth", checkAuth);

module.exports = router;
