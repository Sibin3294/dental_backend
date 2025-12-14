const express = require("express");

const { markDentistAttendance } = require("../controllers/attendence_controller");
const { getDentistAttendanceByDate } = require("../controllers/attendence_controller");

const router = express.Router();

router.post("/markDentistAttendance", markDentistAttendance);
router.post("/getDentistAttendanceByDate", getDentistAttendanceByDate);

module.exports = router;
