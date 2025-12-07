const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment"); // import Appointment model


// exports.addPayment = async (req, res) => {
//   try {
//     const {
//       patientId,
//       appointmentId,
//       appointmentType,
//       paymentMode,
//       dentist,
//       amount,
//       notes,
//       paymentDate,
//     } = req.body;

//     // Validate required fields
//     if (!patientId || !appointmentId || !dentist || !amount) {
//       return res.status(400).json({
//         error: "patientId, appointmentId, dentist, and amount are required fields.",
//       });
//     }

//     const payment = new Payment({
//       patientId,
//       appointmentId,
//       appointmentType,
//       paymentMode,
//       dentist,
//       amount,
//       notes,
//       paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
//       paymentStatus: "completed", // or pending depending on flow
//     });

//     await payment.save();

//     return res.status(200).json({
//         success: true,
//       message: "Payment added successfully",
//       data: payment,
//     });
//   } catch (error) {
//     console.error("Error adding payment:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.addPayment = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      appointmentType,
      paymentMode,
      dentist,
      amount,
      notes,
      paymentDate,
    } = req.body;

    // Validate required fields
    if (!patientId || !appointmentId || !dentist || !amount) {
      return res.status(400).json({
        error: "patientId, appointmentId, dentist, and amount are required fields.",
      });
    }

   // Check if payment already exists for this appointment and patient
const existingPayment = await Payment.findOne({ 
  appointmentId, 
  patientId 
});

if (existingPayment) {
  return res.status(400).json({
    success: false,
    message: "Payment has already been made for this patient and appointment.",
  });
}


    // Create new payment
    const payment = new Payment({
      patientId,
      appointmentId,
      appointmentType,
      paymentMode,
      dentist,
      amount,
      notes,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      paymentStatus: "completed",
    });

    await payment.save();

    // Optional: Update appointment paymentStatus to "completed"
    await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: "completed" });

    return res.status(200).json({
      success: true,
      message: "Payment added successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// GET ALL PAYMENTS
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("patientId", "name email phone")
      .populate("appointmentId", "date time type")
      .populate("dentist", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET PAYMENTS BY PATIENT ID
// exports.getPaymentsByPatientId = async (req, res) => {
//   try {
//     const { patientId } = req.params;

//     const payments = await Payment.find({ patientId })
//       .populate("patientId", "name email phone")
//       .populate("appointmentId", "date time type")
//       .populate("dentist", "name")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: payments.length,
//       data: payments,
//     });
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// exports.getPaymentsByPatientId = async (req, res) => {
//   try {
//     console.log("➡️ API Hit: getPaymentsByPatientId");

//     const { patientId } = req.params;
//     console.log("➡️ Received patientId:", patientId);

//     const payments = await Payment.find({ patientId });

//     console.log("➡️ Payments found:", payments.length);

//     return res.status(200).json({
//       success: true,
//       count: payments.length,
//       data: payments,
//     });

//   } catch (error) {
//     console.error("❌ Error fetching payments:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.getPaymentsByPatientId = async (req, res) => {
  try {
    console.log("➡️ API Hit: getPaymentsByPatientId");

    const { patientId } = req.params;
    console.log("➡️ Received patientId:", patientId);

    const payments = await Payment.find({ patientId })
      .populate("patientId", "name email phone image")    // 👈 Patient info
      .populate("dentist", "name specialization image")   // 👈 Dentist info
      .populate("appointmentId")                          // 👈 Full appointment
      .sort({ createdAt: -1 });

    console.log("➡️ Payments found:", payments.length);

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });

  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// DELETE a payment
exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Validate ID
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      data: deletedPayment,
    });

  } catch (error) {
    console.error("Delete Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

