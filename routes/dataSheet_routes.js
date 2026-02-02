const express = require("express");
const { exportPatientsData } = require("../controllers/dataSheet_controller");



const router = express.Router();

router.get("/patients/export", exportPatientsData);



module.exports = router;


