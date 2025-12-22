

const express = require("express");
const { getAllPatients } = require("../controllers/user_controller");
const {addMorePatientInfo}= require("../controllers/user_controller");
const {deletePatient}= require("../controllers/user_controller");
const {updatePatient}= require("../controllers/user_controller");
const {getUserProfile}= require("../controllers/user_controller");
const {editUserProfile}= require("../controllers/user_controller");
const {saveFcmToken}= require("../controllers/user_controller");


const router = express.Router();

router.get("/getAllPatients", getAllPatients);
router.post("/addMorePatientInfo",addMorePatientInfo);
router.delete("/:id",deletePatient);
router.put("/update/:id",updatePatient);
router.get("/profile/:userId",getUserProfile);
router.put("/profile/edit",editUserProfile);
router.post("/user/saveFcmToken",saveFcmToken);

module.exports = router;