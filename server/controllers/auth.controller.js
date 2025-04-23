const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { createToken } = require("../config/jwt");

// Email/Password Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    const token = createToken(user._id);
    res.status(201).json({ token, user: { id: user._id, email, role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Email/Password Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = createToken(user._id);
    res.json({ token, user: { id: user._id, email, role: user.role } });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Google OAuth Success Redirect
exports.googleAuthSuccess = async (req, res) => {
  const token = createToken(req.user._id);
  res.json({ token, user: req.user });
};
