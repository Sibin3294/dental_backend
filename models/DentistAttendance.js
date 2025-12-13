const mongoose = require("mongoose");

const DentistAttendanceSchema = new mongoose.Schema(
  {
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin id (optional)
      default: null,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔒 One attendance per dentist per day
DentistAttendanceSchema.index(
  { dentistId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "DentistAttendance",
  DentistAttendanceSchema
);
