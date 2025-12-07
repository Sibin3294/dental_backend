const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  // ---------- MORE INFO ----------
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  dob: { type: String },
  bloodGroup: { type: String },
  weight : { type: String },
  height: { type: String },
  lastVisitDate: { type: String },
});

module.exports = mongoose.model("User", UserSchema);

// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     // Basic Identity
//     name: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     phone: { type: String, required: true },
//     password: { type: String, required: true },

//     // Personal Details
//     dateOfBirth: { type: Date },
//     gender: { type: String, enum: ["Male", "Female", "Other"] },
//     address: {
//       line1: String,
//       line2: String,
//       city: String,
//       state: String,
//       postalCode: String,
//       country: { type: String, default: "India" },
//     },

//     // Dental-specific details
//     allergies: [{ type: String }], // e.g., "Penicillin", "Lidocaine"
//     medicalConditions: [{ type: String }], // e.g., "Diabetes", "BP"
//     medications: [{ type: String }], // Current medications
//     bloodGroup: { type: String },

//     // Dental History
//     lastVisitDate: { type: Date },
//     previousDentist: { type: String },
//     dentalConcerns: [{ type: String }], // tooth pain, cleaning, implants etc.

//     // Emergency Contact
//     emergencyContact: {
//       name: String,
//       relation: String,
//       phone: String,
//     },

//     // System Fields
//     isActive: { type: Boolean, default: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", UserSchema);
