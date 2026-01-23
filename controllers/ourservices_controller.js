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
        "🦷 New dental video added!",
        title
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


//delete service video

exports.deleteServiceVideo = async (req, res) => {
  try {
    // const { videoId } = req.params;
    const { videoId } = req.body;

    const video = await ServiceVideo.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Service video not found",
      });
    }

    // Optional: delete thumbnail from storage here

    await ServiceVideo.findByIdAndDelete(videoId);

    return res.status(200).json({
      success: true,
      message: "Service video permanently deleted",
    });

  } catch (error) {
    console.error("Hard Delete Service Video Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all videos

// exports.getAllServiceVideos = async (req, res) => {
//   try {
//     const { serviceId, category, isActive, page = 1, limit = 10 } = req.query;

//     const filter = {};

//     if (isActive !== undefined) {
//       filter.isActive = isActive === "true";
//     }

//     if (serviceId) {
//       filter.serviceId = serviceId;
//     }

//     if (category) {
//       filter.category = category;
//     }

//     const skip = (page - 1) * limit;

//     const [videos, total] = await Promise.all([
//       ServiceVideo.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit)),
//       ServiceVideo.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       message: "Service videos fetched successfully",
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       data: videos,
//     });

//   } catch (error) {
//     console.error("Get Service Videos Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

exports.getAllServiceVideos = async (req, res) => {
  try {
    const videos = await ServiceVideo.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All service videos fetched successfully",
      total: videos.length,
      data: videos,
    });

  } catch (error) {
    console.error("Get Service Videos Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
