const Booking = require("../models/Booking.model");
const TravelPackage = require("../models/TravelPackage.model");

exports.createBooking = async (req, res) => {
  try {
    const { packageId, selectedServices } = req.body;
    const userId = req.user.id;

    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage) throw new Error("Package not found");

    // placeholder values for food and accomodation
    const serviceCosts = {
      Food: 500,
      Accommodation: 1000,
    };

    const additionalCost = selectedServices.reduce(
      (sum, service) => sum + (serviceCosts[service] || 0),
      0
    );

    const totalPrice = travelPackage.basePrice + additionalCost;

    const booking = await Booking.create({
      userId,
      packageId,
      selectedServices,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate("packageId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
