const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  appointmentType: String,
  paymentMode: String,
  dentist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dentist",
    required: true,
  },
  amount: String,
  notes: String,
  paymentDate: Date,
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
      "refunded",
      "partially_refunded",
    ],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);

