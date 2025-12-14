const Dentist = require("../models/Dentist");
const DentistSlot = require("../models/DentistSlot");
const DentistAttendance =require("../models/DentistAttendance");
const Appointment=require("../models/Appointment");


// get all dentist

exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();
    res.json({ success: true, data: dentists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// exports.getAllDentists = async (req, res) => {
//   try {
//     const date = req.query.date ? new Date(req.query.date) : new Date();

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const dentists = await Dentist.find().lean();
//     const dentistIds = dentists.map(d => d._id);

//     const slots = await DentistSlot.find({
//       dentistId: { $in: dentistIds },
//       date: { $gte: startOfDay, $lte: endOfDay }
//     }).lean();

//     const slotMap = {};
//     slots.forEach(s => {
//       slotMap[s.dentistId.toString()] = s.slots;
//     });

//     res.json({
//       success: true,
//       data: dentists.map(d => ({
//         ...d,
//         slots: slotMap[d._id.toString()] || []
//       }))
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getAllDentists = async (req, res) => {
//   try {
//     const date = req.query.date
//       ? new Date(req.query.date)
//       : new Date();

//     date.setHours(0, 0, 0, 0);

//     const dentists = await Dentist.find().lean();

//     const dentistIds = dentists.map(d => d._id);

//     const slots = await DentistSlot.find({
//       dentistId: { $in: dentistIds },
//       date
//     }).lean();

//     const slotMap = {};
//     slots.forEach(s => {
//       slotMap[s.dentistId.toString()] = s.slots;
//     });

//     const response = dentists.map(dentist => ({
//       ...dentist,
//       slots: slotMap[dentist._id.toString()] || []
//     }));

//     res.json({
//       success: true,
//       date,
//       data: response
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };



// add new dentist

exports.addDentist = async (req, res) => {
  try {
    const { name, specialization, image, experience, qualification } = req.body;

    // Validate required fields
    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Name and specialization are required",
      });
    }

    // Create new dentist
    const newDentist = new Dentist({
      name,
      specialization,
      image: image || "",
      experience: experience || "",
      qualification: qualification || "",
    });

    const savedDentist = await newDentist.save();

    return res.status(200).json({
      success: true,
      message: "Dentist added successfully",
      data: savedDentist,
    });
  } catch (error) {
    console.error("Add Dentist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Add More Info to Dentist
exports.addMoreInfo = async (req, res) => {
  try {
    const { dentistId } = req.body;

    if (!dentistId) {
      return res.status(400).json({
        success: false,
        message: "dentistId is required",
      });
    }

    const updateData = {
      biography: req.body.biography,
      availableDays: req.body.availableDays,
      consultationTimings: req.body.consultationTimings,
      languagesKnown: req.body.languagesKnown,
      awards: req.body.awards,
      specialProcedures: req.body.specialProcedures,
      website: req.body.website,
      roomLocation: req.body.roomLocation,
    };

    const updatedDentist = await Dentist.findByIdAndUpdate(
      dentistId,
      updateData,
      { new: true }
    );

    if (!updatedDentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "More information added successfully",
      data: updatedDentist,
    });

  } catch (error) {
    console.error("Add More Info Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete a dentist

exports.deleteDentist = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDentist = await Dentist.findByIdAndDelete(id);

    if (!deletedDentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    res.json({
      success: true,
      message: "Dentist deleted successfully",
      deleted: deletedDentist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update dentist details

exports.updateDentist = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Dentist.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        specialization: req.body.specialization,
        image: req.body.image,
        experience: req.body.experience,
        qualification: req.body.qualification,

        // --- MORE INFO FIELDS (optional) ---
        biography: req.body.biography,
        availableDays: req.body.availableDays,
        consultationTimings: req.body.consultationTimings,
        languagesKnown: req.body.languagesKnown,
        awards: req.body.awards,
        specialProcedures: req.body.specialProcedures,
        website: req.body.website,
        roomLocation: req.body.roomLocation,
      },
      { new: true } // returns updated doc
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Dentist not found" });
    }

    res.json({
      success: true,
      message: "Dentist updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ADD SLOTS FOR DENTISTS
exports.addDentistSlots = async (req, res) => {
  try {
    const { dentistId } = req.params;
    const { date, slots } = req.body;

    if (!date || !slots || slots.length === 0) {
      return res.status(400).json({
        message: "Date and slots are required"
      });
    }

    const slotObjects = slots.map(time => ({
      time,
      isBooked: false
    }));

    const dentistSlot = await DentistSlot.create({
      dentistId,
      date: new Date(date),
      slots: slotObjects
    });

    res.status(201).json({
      message: "Dentist slots added successfully",
      data: dentistSlot
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Slots already added for this dentist on this date"
      });
    }

    res.status(500).json({
      message: "Failed to add slots",
      error: error.message
    });
  }
};

// GET DENTISTS SLOTS
exports.getDentistSlots = async (req, res) => {
  try {
    const { dentistId } = req.params;
    const { date } = req.query;

    const query = { dentistId };

    if (date) {
      query.date = new Date(date);
    }

    const slots = await DentistSlot.find(query).sort({ date: 1 });

    res.json({
      message: "Slots fetched successfully",
      data: slots
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch slots",
      error: error.message
    });
  }
};

// get dentist slots by date

// exports.getAllDentistsSlotsByDate = async (req, res) => {
//   try {
//     const date = req.query.date
//       ? new Date(req.query.date)
//       : new Date();

//     date.setHours(0, 0, 0, 0);

//     const dentists = await Dentist.find().lean();
//     const dentistIds = dentists.map(d => d._id);

//     const slots = await DentistSlot.find({
//       dentistId: { $in: dentistIds },
//       date
//     }).lean();

//     const slotMap = {};
//     slots.forEach(s => {
//       slotMap[s.dentistId.toString()] = s.slots;
//     });

//     res.json({
//       success: true,
//       data: dentists.map(d => ({
//         ...d,
//         slots: slotMap[d._id.toString()] || []
//       }))
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getAllDentistsSlotsByDate = async (req, res) => {
//   try {
//     const dateStr = req.query.date;

//     if (!dateStr) {
//       return res.status(400).json({ message: "Date is required" });
//     }

//     const start = new Date(dateStr);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(dateStr);
//     end.setHours(23, 59, 59, 999);

//     const dentists = await Dentist.find().lean();
//     const dentistIds = dentists.map(d => d._id);

//     const slots = await DentistSlot.find({
//       dentistId: { $in: dentistIds },
//       date: { $gte: start, $lte: end }
//     }).lean();

//     const slotMap = {};
//     slots.forEach(s => {
//       slotMap[s.dentistId.toString()] = s.slots;
//     });

//     res.json({
//       success: true,
//       data: dentists.map(d => ({
//         ...d,
//         slots: slotMap[d._id.toString()] || []
//       }))
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

exports.getAllDentistsSlotsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const dentists = await Dentist.find().lean();
    const dentistIds = dentists.map(d => d._id);

    const slots = await DentistSlot.find({
      dentistId: { $in: dentistIds },
      date: { $gte: start, $lte: end }
    }).lean();

    const slotMap = {};
    slots.forEach(s => {
      slotMap[s.dentistId.toString()] = s.slots;
    });

    res.json({
      success: true,
      data: dentists.map(d => ({
        ...d,
        slots: slotMap[d._id.toString()] || []
      }))
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



// update dentists slots

exports.updateDentistSlots = async (req, res) => {
  try {
    const { dentistId } = req.params;
    const { date, slots } = req.body;

    if (!date || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        message: "Date and slots are required"
      });
    }

    // Normalize date (VERY IMPORTANT)
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    let dentistSlot = await DentistSlot.findOne({
      dentistId,
      date: slotDate
    });

    // Convert incoming slots to objects
    const incomingSlots = slots.map(time => ({
      time,
      isBooked: false
    }));

    // ✅ If no slots exist → CREATE
    if (!dentistSlot) {
      dentistSlot = await DentistSlot.create({
        dentistId,
        date: slotDate,
        slots: incomingSlots
      });

      return res.json({
        message: "Slots created successfully",
        data: dentistSlot
      });
    }

    // ✅ If slots exist → MERGE
    const existingTimes = new Set(
      dentistSlot.slots.map(s => s.time)
    );

    incomingSlots.forEach(slot => {
      if (!existingTimes.has(slot.time)) {
        dentistSlot.slots.push(slot);
      }
    });

    await dentistSlot.save();

    res.json({
      message: "Slots updated successfully",
      data: dentistSlot
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update slots",
      error: error.message
    });
  }
};

//getAvailableDentistsByDate
// exports.getAvailableDentistsByDate = async (req, res) => {
//   const { date } = req.query;

//   if (!date) {
//     return res.status(400).json({ message: "Date is required" });
//   }

//   const start = new Date(date);
//   start.setHours(0, 0, 0, 0);

//   const end = new Date(date);
//   end.setHours(23, 59, 59, 999);

//   // 1️⃣ Get dentists
//   const dentists = await Dentist.find();

//   // 2️⃣ Get attendance
//   const attendance = await DentistAttendance.find({
//     date: { $gte: start, $lte: end }
//   });

//   const attendanceMap = {};
//   attendance.forEach(a => {
//     attendanceMap[a.dentistId.toString()] = a.status;
//   });

//   // 3️⃣ Get booked appointments
//   const appointments = await Appointment.find({
//     date: { $gte: start, $lte: end }
//   });

//   const bookedMap = {};
//   appointments.forEach(a => {
//     const key = `${a.dentistId}_${a.time}`;
//     bookedMap[key] = true;
//   });

//   // 4️⃣ Build response
//   const response = dentists.map(d => {
//     if (attendanceMap[d._id] !== "present") return null;

//     const slots = d.slots.map(time => ({
//       time,
//       available: !bookedMap[`${d._id}_${time}`]
//     }));

//     return {
//       id: d._id,
//       name: d.name,
//       speciality: d.speciality,
//       email: d.email,
//       slots
//     };
//   }).filter(Boolean);

//   res.json({ success: true, data: response });
// };

// exports.getAvailableDentistsByDate = async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) return res.status(400).json({ message: "Date is required" });

//     const start = new Date(date);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(date);
//     end.setHours(23, 59, 59, 999);

//     // 1️⃣ Get all dentists
//     const dentists = await Dentist.find();

//     // 2️⃣ Get attendance
//     const attendance = await DentistAttendance.find({
//       date: { $gte: start, $lte: end }
//     });

//     const attendanceMap = {};
//     attendance.forEach(a => {
//       attendanceMap[a.dentistId.toString()] = a.status;
//     });

//     // 3️⃣ Get booked appointments
//     const appointments = await Appointment.find({
//       startTime: { $gte: start, $lte: end }
//     });

//     const bookedMap = {};
//     appointments.forEach(a => {
//       if (!a.dentist) return;
//       const key = `${a.dentist.toString()}_${a.startTime.toISOString()}`;
//       bookedMap[key] = true;
//     });

//     // 4️⃣ Build response
//     const response = dentists.map(d => {
//       if (attendanceMap[d._id.toString()] !== "present") return null;

//       // Use default slots (example: 10AM, 11AM, 2PM, 4PM)
//       const slotsArray = ["10:00", "11:00", "14:00", "16:00"];

//       const slots = slotsArray.map(time => {
//         // Convert time to ISO for checking booked appointments
//         const [hour, minute] = time.split(":").map(Number);
//         const slotDate = new Date(start);
//         slotDate.setHours(hour, minute, 0, 0);
//         const key = `${d._id.toString()}_${slotDate.toISOString()}`;

//         return {
//           time,
//           available: !bookedMap[key]
//         };
//       });

//       return {
//         id: d._id,
//         name: d.name,
//         speciality: d.specialization,
//         email: d.email,
//         slots
//       };
//     }).filter(Boolean);

//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//   }
// };


// exports.getAvailableDentistsByDate = async (req, res) => {
//   try {
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ message: "Date is required" });
//     }

//     // Normalize date
//     const selectedDate = new Date(date);
//     selectedDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(selectedDate);
//     endDate.setHours(23, 59, 59, 999);

//     // 1️⃣ Get all dentists
//     const dentists = await Dentist.find().lean();
//     const dentistIds = dentists.map(d => d._id);

//     // 2️⃣ Attendance (only PRESENT dentists)
//     const attendance = await DentistAttendance.find({
//       dentistId: { $in: dentistIds },
//       date: selectedDate,
//       status: "present"
//     }).lean();

//     const presentDentistIds = attendance.map(a =>
//       a.dentistId.toString()
//     );

//     // 3️⃣ Get slots for date
//     // const slots = await DentistSlot.find({
//     //   dentistId: { $in: presentDentistIds },
//     //   date: selectedDate
//     // }).lean();
//     const slots = await DentistSlot.find({
//   dentistId: { $in: presentDentistIds },
//   date: { $gte: start, $lte: end }
// }).lean();

//     const slotMap = {};
//     slots.forEach(s => {
//       slotMap[s.dentistId.toString()] = s.slots;
//     });

//     // 4️⃣ Get booked appointments
//     const appointments = await Appointment.find({
//       dentist: { $in: presentDentistIds },
//       startTime: { $gte: selectedDate, $lte: endDate },
//       status: { $ne: "cancelled" }
//     }).lean();

//     const bookedMap = {};
//     appointments.forEach(a => {
//       const timeKey = a.startTime.toISOString();
//       bookedMap[`${a.dentist}_${timeKey}`] = true;
//     });

//     // 5️⃣ Build response
//     const response = dentists
//       .filter(d => presentDentistIds.includes(d._id.toString()))
//       .map(d => {
//         const dentistSlots = slotMap[d._id.toString()] || [];

//         const formattedSlots = dentistSlots.map(slot => {
//           const slotDateTime = new Date(`${date}T${slot}`);
//           return {
//             time: slot,
//             available: !bookedMap[`${d._id}_${slotDateTime.toISOString()}`]
//           };
//         });

//         return {
//           id: d._id,
//           name: d.name,
//           speciality: d.specialization,
//           email: d.email,
//           slots: formattedSlots
//         };
//       });

//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };

exports.getAvailableDentistsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // ✅ DEFINE START & END FIRST
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 1️⃣ Get dentists
    const dentists = await Dentist.find().lean();

    // 2️⃣ Get attendance
    const attendance = await DentistAttendance.find({
      date: { $gte: start, $lte: end }
    }).lean();

    const attendanceMap = {};
    attendance.forEach(a => {
      attendanceMap[a.dentistId.toString()] = a.status;
    });

    // 3️⃣ Get booked appointments
    const appointments = await Appointment.find({
      startTime: { $gte: start, $lte: end }
    }).lean();

    const bookedMap = {};
    appointments.forEach(a => {
      const key = `${a.dentist}_${a.startTime.toISOString()}`;
      bookedMap[key] = true;
    });

    // 4️⃣ Get slots
    const dentistIds = dentists.map(d => d._id);
    const slots = await DentistSlot.find({
      dentistId: { $in: dentistIds },
      date: { $gte: start, $lte: end }
    }).lean();

    const slotMap = {};
    slots.forEach(s => {
      slotMap[s.dentistId.toString()] = s.slots;
    });

    // 5️⃣ Build response
    const response = dentists.map(d => {
      if (attendanceMap[d._id.toString()] !== "present") return null;

      const dentistSlots = slotMap[d._id.toString()] || [];

      return {
        id: d._id,
        name: d.name,
        speciality: d.specialization,
        email: d.email,
        slots: dentistSlots.map(time => ({
          time,
          available: true // booking check can be added later
        }))
      };
    }).filter(Boolean);

    res.json({ success: true, data: response });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
