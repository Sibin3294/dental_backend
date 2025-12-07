const Dentist = require("../models/Dentist");
const Appointment = require("../models/Appointment");

// exports.createAppointment = async (req, res) => {
//   try {
//     const { patientName, mobile, reason, dentist, startTime, endTime } = req.body;

//     // -----------------------------
//     // VALIDATION
//     // -----------------------------
//     if (!patientName)
//       return res.status(400).json({ success: false, message: "patientName is required" });

//     if (!mobile)
//       return res.status(400).json({ success: false, message: "mobile is required" });

//     if (!/^[0-9]{10}$/.test(mobile))
//       return res.status(400).json({ success: false, message: "mobile must be a valid 10-digit number" });

//     if (!reason)
//       return res.status(400).json({ success: false, message: "reason is required" });

//     if (!dentist)
//       return res.status(400).json({ success: false, message: "dentist is required" });

//     if (!startTime)
//       return res.status(400).json({ success: false, message: "startTime is required" });

//     if (!endTime)
//       return res.status(400).json({ success: false, message: "endTime is required" });

//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     if (start >= end)
//       return res.status(400).json({
//         success: false,
//         message: "startTime must be less than endTime",
//       });

//     // dentist exists?
//     const dentistExists = await Dentist.findById(dentist);
//     if (!dentistExists)
//       return res.status(404).json({ success: false, message: "Dentist does not exist" });

//     // -----------------------------
//     // CHECK FOR OVERLAPPING TIME
//     // -----------------------------
//     const overlap = await Appointment.findOne({
//       dentist,
//       $or: [
//         { startTime: { $lt: end }, endTime: { $gt: start } }
//       ]
//     });

//     if (overlap) {
//       return res.status(400).json({
//         success: false,
//         message: "This time slot is already booked for this dentist"
//       });
//     }

//     // -----------------------------
//     // CREATE APPOINTMENT
//     // -----------------------------
//     const appt = await Appointment.create(req.body);
//     const populated = await appt.populate("dentist");

//     return res.json({
//       success: true,
//       message: "Appointment created successfully",
//       data: populated
//     });

//   } catch (e) {
//     return res.status(500).json({ success: false, message: e.message });
//   }
// };

const User = require("../models/User"); // <-- import your user model

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, reason, dentist, startTime, endTime } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!patientId)
      return res.status(400).json({ success: false, message: "patientId is required" });

    if (!reason)
      return res.status(400).json({ success: false, message: "reason is required" });

    if (!dentist)
      return res.status(400).json({ success: false, message: "dentist is required" });

    if (!startTime)
      return res.status(400).json({ success: false, message: "startTime is required" });

    if (!endTime)
      return res.status(400).json({ success: false, message: "endTime is required" });

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end)
      return res.status(400).json({
        success: false,
        message: "startTime must be less than endTime",
      });

    // -----------------------------
    // VALIDATE REGISTERED PATIENT
    // -----------------------------
    const patient = await User.findById(patientId);
    if (!patient)
      return res.status(404).json({ success: false, message: "Patient does not exist" });

    // -----------------------------
    // VALIDATE DENTIST
    // -----------------------------
    const dentistExists = await Dentist.findById(dentist);
    if (!dentistExists)
      return res.status(404).json({ success: false, message: "Dentist does not exist" });

    // -----------------------------
    // CHECK FOR OVERLAPPING TIME
    // -----------------------------
    const overlap = await Appointment.findOne({
      dentist,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (overlap) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked for this dentist"
      });
    }

    // -----------------------------
    // PREPARE APPOINTMENT DATA
    // -----------------------------
    const appointmentData = {
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`.trim(), // auto-fill
      mobile: patient.mobile, // auto-fill
      reason,
      dentist,
      startTime,
      endTime,
      paymentStatus: "pending"
    };

    // -----------------------------
    // CREATE APPOINTMENT
    // -----------------------------
    const appt = await Appointment.create(appointmentData);
    // const populated = await appt.populate("dentist").populate("patientId");
    const populated = await appt.populate([
  { path: "dentist" },
  { path: "patientId" }
]);


    return res.json({
      success: true,
      message: "Appointment created successfully",
      data: populated
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};



// get all appointments

// exports.getAppointments = async (req, res) => {
//   try {
//     const appts = await Appointment.find()
//       .populate("dentist")
//       .sort({ startTime: 1 });

//     return res.json({
//       success: true,
//       data: appts
//     });

//   } catch (e) {
//     return res.status(500).json({ success: false, message: e.message });
//   }
// };

exports.getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate("dentist")
      .populate("patientId")  // 👈 THIS LINE
      .sort({ startTime: 1 });

    return res.json({
      success: true,
      data: appts
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};



//Get Appointments by Date

exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date)
      return res.status(400).json({ success: false, message: "date is required (YYYY-MM-DD)" });

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const appts = await Appointment.find({
      startTime: { $gte: start, $lte: end }
    }).populate("dentist");

    return res.json({
      success: true,
      data: appts
    });

    

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Update Appointment

exports.updateAppointment = async (req, res) => {
  try {
    const { startTime, endTime, dentist } = req.body;

    // If editing time, validate
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end)
        return res.status(400).json({
          success: false,
          message: "startTime must be less than endTime"
        });

      // check overlap with other appointments
      const overlap = await Appointment.findOne({
        _id: { $ne: req.params.id },
        dentist,
        startTime: { $lt: end },
        endTime: { $gt: start },
      });

      if (overlap)
        return res.status(400).json({
          success: false,
          message: "This time slot is already booked for this dentist"
        });
    }

    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!appt)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    return res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appt
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};


//Delete Appointment

exports.deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id);

    if (!appt)
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });

    return res.json({
      success: true,
      message: "Appointment deleted successfully"
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

//updateAppointmentStatus

exports.updateAppointmentStatus=async(req,res)=>{
  try{
   const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "id and status are required" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Status updated successfully",
      appointment: updated
    });
  }catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// patient history

exports.getPatientHistoryById = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "patientId is required"
      });
    }

    // Fetch all appointments for this patient
    const history = await Appointment.find({ patientId })
      .populate("dentist")
      .populate("patientId") 
      .sort({ startTime: -1 }); // newest first

    return res.json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};
