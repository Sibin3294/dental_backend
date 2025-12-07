// const mongoose = require("mongoose");

// const DentistSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   specialization: { type: String, required: true },
//   image: { type: String }, // URL to image
//   experience: { type: String },
//   qualification: { type: String }
// });

// module.exports = mongoose.model("Dentist", DentistSchema);

const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  image: { type: String },

  experience: { type: String },
  qualification: { type: String },

  // ---------- MORE INFO ----------
  biography: { type: String },
  availableDays: { type: String },
  consultationTimings: { type: String },
  languagesKnown: { type: String },
  awards: { type: String },
  specialProcedures: { type: String },
  website: { type: String },
  roomLocation: { type: String },
});

module.exports = mongoose.model("Dentist", DentistSchema);
