const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signup,
  login,
  googleAuthSuccess,
} = require("../controllers/auth.controller");

// Email/Password Auth
router.post("/signup", signup);
router.post("/login", login);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthSuccess
);

module.exports = router;
