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
  fcmToken: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", UserSchema);


