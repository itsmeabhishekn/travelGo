const TravelPackage = require("../models/TravelPackage.model");

exports.createPackage = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.create({
      ...req.body,
      createdBy: req.user.id, // Admin ID
    });
    res.status(201).json(travelPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!travelPackage) throw new Error("Package not found");
    res.json(travelPackage);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findByIdAndDelete(req.params.id);
    if (!travelPackage) throw new Error("Package not found");
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.listPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findById(req.params.id);
    if (!travelPackage) throw new Error("Package not found");
    res.json(travelPackage);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
