const express = require("express");
const { addServiceVideo } = require("../controllers/ourservices_controller");
const { deleteServiceVideo } = require("../controllers/ourservices_controller");
const { getAllServiceVideos } = require("../controllers/ourservices_controller");
const router = express.Router();

router.post("/addServiceVideo", addServiceVideo);
router.delete("/deleteServiceVideo", deleteServiceVideo);
router.get("/getAllServiceVideos", getAllServiceVideos);


module.exports = router;