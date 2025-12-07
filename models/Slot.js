const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  dentistId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  isBooked: { type: Boolean, default: false },
});

module.exports = mongoose.model("Slot", SlotSchema);
