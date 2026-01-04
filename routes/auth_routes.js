const express = require("express");
const { register, login,saveFcmToken,forgotPassword,resetPassword } = require("../controllers/auth_controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/saveFcmToken",saveFcmToken);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword",resetPassword);



module.exports = router;
