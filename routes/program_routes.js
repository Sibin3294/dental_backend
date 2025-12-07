const express = require("express");
const { homeData } = require("../controllers/program_controller");
const router = express.Router();

router.get("/home", homeData);

module.exports = router;
