const express = require("express");

const { markDentistAttendance } = require("../controllers/attendence_controller");


const router = express.Router();

router.post("/markDentistAttendance", markDentistAttendance);



module.exports = router;
