const Testimonial = require("../models/Testimonial");
const User = require("../models/User");
const { sendPushToMany } = require("../utils/pushNotification");


// Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { userId, message, rating } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required"
      });
    }

    // Fetch user details using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    const testimonial = await Testimonial.create({
      userId,
      name: user.name,      // fetched automatically
      message,
      rating
    });

     // 3️⃣ Get all users EXCEPT testimonial creator & with valid FCM tokens
    const users = await User.find({
      _id: { $ne: userId },              // ❌ exclude creator
      fcmToken: { $exists: true, $ne: "" }
    }).select("fcmToken");

    const tokens = users.map(u => u.fcmToken);

    // 4️⃣ Send push notification
    if (tokens.length > 0) {
      await sendPushToMany(
        tokens,
        "🦷 New review added!",
        `${user.name} added a new review`,
        {
          type: "NEW_TESTIMONIAL",
          testimonialId: testimonial._id.toString(),
        }
      );
    }

    res.status(201).json({
      status: true,
      message: "Testimonial submitted successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


// Get all (only approved for public)
exports.getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });

    res.json({ status: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Admin: Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({ status: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Approve / Reject
exports.updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    res.json({
      status: true,
      message: `Testimonial ${isApproved ? "approved" : "rejected"}`,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({ status: true, message: "Testimonial deleted sucessfuly" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
