const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  title: String,
  image: String,
  route: String,
});

module.exports = mongoose.model("Program", ProgramSchema);
