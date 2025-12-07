const Slot = require("../models/Slot");

exports.getSlots = async (req, res) => {
  const { dentistId } = req.query;
  const slots = await Slot.find({ dentistId });
  res.json(slots);
};
