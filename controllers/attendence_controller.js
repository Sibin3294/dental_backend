const DentistAttendance = require("../models/DentistAttendance");

exports.markDentistAttendance = async (req, res) => {
  try {
    const { date, attendance } = req.body;

    if (!date || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({
        message: "Date and attendance list are required",
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = attendance.map((item) => ({
      updateOne: {
        filter: {
          dentistId: item.dentistId,
          date: attendanceDate,
        },
        update: {
          $set: {
            status: item.status,
            remarks: item.remarks || "",
          },
        },
        upsert: true, // ✅ insert if not exists
      },
    }));

    await DentistAttendance.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// GET /api/dentists/attendance?date=2025-12-13

exports.getDentistAttendanceByDate = async (req, res) => {
  try {
    const { adate } = req.body;

    if (!adate) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const attendanceDate = new Date(adate);
    attendanceDate.setHours(0, 0, 0, 0);

    const records = await DentistAttendance.find({
      adate: attendanceDate,
    }).select("dentistId status remarks");

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};


