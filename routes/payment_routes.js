const express = require("express");
const { addPayment } = require("../controllers/payment_controller");
const { getAllPayments } = require("../controllers/payment_controller");
const { getPaymentsByPatientId } = require("../controllers/payment_controller");
const { deletePayment } = require("../controllers/payment_controller");


const router = express.Router();

router.post("/addPayment", addPayment);
router.get("/getAllPayments",getAllPayments);
router.get("/:patientId",getPaymentsByPatientId);
router.delete("/deletePayment/:paymentId",deletePayment);



module.exports = router;