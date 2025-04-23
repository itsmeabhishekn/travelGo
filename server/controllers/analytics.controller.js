const User = require("../models/User.model");
const Booking = require("../models/Booking.model");
const TravelPackage = require("../models/TravelPackage.model");

// Fetch all users and their bookings
exports.getUsersAndBookings = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const bookings = await Booking.find().populate("packageId userId");

    const result = users.map((user) => {
      const userBookings = bookings.filter(
        (booking) => booking.userId._id.toString() === user._id.toString()
      );
      return { user, bookings: userBookings };
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching users and bookings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch package status based on current date
exports.getPackageStatus = async (req, res) => {
  try {
    const today = new Date();

    const completed = await TravelPackage.find({ endDate: { $lt: today } });
    const active = await TravelPackage.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    const upcoming = await TravelPackage.find({ startDate: { $gt: today } });

    res.json({ completed, active, upcoming });
  } catch (err) {
    console.error("Error fetching package status:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch booking count per package
exports.getBookingCountPerPackage = async (req, res) => {
  try {
    const bookingCounts = await Booking.aggregate([
      {
        $group: {
          _id: "$packageId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "travelpackages",
          localField: "_id",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $unwind: "$package",
      },
      {
        $project: {
          _id: 0,
          packageId: "$package._id",
          packageName: { $concat: ["$package.from", " → ", "$package.to"] },
          count: 1,
        },
      },
    ]);

    res.json(bookingCounts);
  } catch (err) {
    console.error("Error fetching booking count per package:", err);
    res.status(500).json({ error: err.message });
  }
};
