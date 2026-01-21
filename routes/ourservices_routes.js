const express = require("express");
const { addServiceVideo } = require("../controllers/ourservices_controller");
const { deleteServiceVideo } = require("../controllers/ourservices_controller");
const router = express.Router();

router.post("/addServiceVideo", addServiceVideo);
router.delete("/deleteServiceVideo", deleteServiceVideo);

module.exports = router;