const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelPackage",
    required: true,
  },
  selectedServices: { type: [String], default: [] },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Accepted", "Cancelled"],
    default: "Accepted",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
