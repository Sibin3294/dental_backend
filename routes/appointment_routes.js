const express = require("express");
const { createAppointment } = require("../controllers/appointment_controller");
const { getAppointments } = require("../controllers/appointment_controller");
const { getAppointmentsByDate } = require("../controllers/appointment_controller");
const { updateAppointment } = require("../controllers/appointment_controller");
const { deleteAppointment } = require("../controllers/appointment_controller");
const {updateAppointmentStatus}= require("../controllers/appointment_controller");
const {getPatientHistoryById} =require("../controllers/appointment_controller")

const router = express.Router();

router.post("/createAppointment", createAppointment);
router.get("/getAppointments",getAppointments);
router.get("/getAppointmentsByDate",getAppointmentsByDate)
router.delete("/:id",deleteAppointment)
router.put("/:id",updateAppointment)
router.post("/updateAppointmentStatus",updateAppointmentStatus)
router.get("/:patientId", getPatientHistoryById);


module.exports = router;


