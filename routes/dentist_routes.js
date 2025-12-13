const express = require("express");
const {
  getAllDentists,
  updateDentist,
} = require("../controllers/dentist_controller");
const { addDentist } = require("../controllers/dentist_controller");
const { addMoreInfo } = require("../controllers/dentist_controller");
const { deleteDentist } = require("../controllers/dentist_controller");
const { addDentistSlots } = require("../controllers/dentist_controller");
const { getDentistSlots } = require("../controllers/dentist_controller");
const { updateDentistSlots } = require("../controllers/dentist_controller");


const router = express.Router();

router.get("/getAllDentists", getAllDentists);
router.post("/addDentist", addDentist);
router.post("/addMoreInfo", addMoreInfo);
router.delete("/:id", deleteDentist);
router.put("/update/:id", updateDentist);
router.post("/:dentistId/slots", addDentistSlots);
router.get("/getDentistSlots", getDentistSlots);
router.get("/getDentistSlots", getDentistSlots);
router.put("/updateDentistSlots/:dentistId/slots", updateDentistSlots);


module.exports = router;
