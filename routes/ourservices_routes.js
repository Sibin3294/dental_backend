const express = require("express");
const { addServiceVideo } = require("../controllers/ourservices_controller");

const router = express.Router();

router.post("/addServiceVideo", addServiceVideo);

module.exports = router;