const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
   patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mobile: String,
  reason: String,
  dentist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dentist"
  },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "missed"],
    default: "scheduled"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
