const mongoose = require("mongoose");

const dentistSlotSchema = new mongoose.Schema(
  {
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Dentist"
    },
    date: {
      type: Date,
      required: true
    },
    slots: [
      {
        time: {
          type: String, // "10:00 AM"
          required: true
        },
        isBooked: {
          type: Boolean,
          default: false
        },
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        }
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate date entries for same dentist
dentistSlotSchema.index({ dentistId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DentistSlot", dentistSlotSchema);
