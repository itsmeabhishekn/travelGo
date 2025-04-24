const { verifyToken } = require("../config/jwt");
const User = require("../models/User.model");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Unauthorized");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    await exports.isAuthenticated(req, res, () => {});
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        redirect: "/", // Redirect user to their dashboard
      });
    }
    next();
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.isUser = async (req, res, next) => {
  try {
    await exports.isAuthenticated(req, res, () => {});
    if (req.user.role !== "user") {
      return res.status(403).json({
        error: "Forbidden",
        redirect: "/admin-dashboard", // Redirect admin to their dashboard
      });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ error: err.message });
  }
};
