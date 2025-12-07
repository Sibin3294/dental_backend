const express = require("express");
const { getSlots } = require("../controllers/slot_controller");
const router = express.Router();

router.get("/", getSlots);

module.exports = router;
