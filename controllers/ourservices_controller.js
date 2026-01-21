const ServiceVideo = require("../models/OurServices");
const { sendPushToMany } = require("../utils/pushNotification");
const User = require("../models/User");

exports.addServiceVideo = async (req, res) => {
  try {
    const {
      serviceId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      language,
      duration,
      clinicId,
      notifyUsers = false,
    } = req.body;

    if (
      !serviceId ||
      !title ||
      !videoUrl ||
      !thumbnailUrl ||
      !category ||
      !clinicId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const video = await ServiceVideo.create({
      serviceId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      language,
      duration,
      clinicId,
    //   uploadedBy: req.user._id, // admin / dentist
      notifyUsers,
    });

    if (notifyUsers) {
     const users = await User.find({ fcmToken: { $ne: "" } }).select("fcmToken");
    
        const tokens = users.map(u => u.fcmToken);
    
        await sendPushToMany(
          tokens,
          "🦷 New Dentist Joined!",
          `Dr. ${name} (${specialization}) is now available for appointments`,
          {
            dentistId: savedDentist._id.toString(),
            type: "NEW_DENTIST",
          }
        );
    }

    // 🔔 SEND PUSH TO ALL USERS
        

    return res.status(201).json({
      success: true,
      message: "Service video added successfully",
      data: video,
    });

  } catch (error) {
    console.error("Add Service Video Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
