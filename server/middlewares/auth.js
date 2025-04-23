const { verifyToken } = require("../config/jwt");
const User = require("../models/User.model");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    if (!req.user) throw new Error("Unauthorized");

    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    await exports.isAuthenticated(req, res, () => {});
    if (req.user.role !== "admin") throw new Error("Forbidden");
    next();
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
