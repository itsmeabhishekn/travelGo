const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signup,
  login,
  googleAuthSuccess,
  checkAuth,
  adminLogin,
} = require("../controllers/auth.controller");

// Email/Password Auth (Signup and Login)
router.post("/signup", signup); // Signup Endpoint
router.post("/login", login); // Login Endpoint
router.post("/admin/login", adminLogin); // Login Endpoint

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthSuccess
);

// Endpoint to check if the user is authenticated (for frontend check)
router.get("/check-auth", checkAuth);

module.exports = router;
