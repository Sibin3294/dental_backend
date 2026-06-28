const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");
const crypto = require("crypto");


// exports.register = async (req, res) => {
//     console.log("register api hit");
//   const { name, email, password } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   const user = new User({ name, email, password: hashed });
//   await user.save();

//   res.json({ message: "User registered" });
// };

// exports.register = async (req, res) => {
//   try {
//     console.log("register api hit");

//     const { name, email, password } = req.body;

//     const hashed = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       password: hashed,
//     });

//     await user.save();

//     // 🔥 Send welcome email
//     sendWelcomeEmail(user); // non-blocking

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Registration failed",
//     });
//   }
// };

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Dental Care 🦷",
        html: `
          <h2>Hello ${name},</h2>
          <p>Welcome to <b>Dental Care</b>.</p>
          <p>Your account has been created successfully.</p>
          <br/>
          <p>🦷 Stay healthy,<br/>Dental Care Team</p>
        `,
      });
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const safeUser = await User.findById(user._id).select("-password -resetPasswordToken -resetPasswordExpires");

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

exports.saveFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ success: false, message: "userId and fcmToken are required" });
    }

    const user = await User.findByIdAndUpdate(userId, { fcmToken }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Save FCM token error:", err);
    res.status(500).json({ success: false, message: "Failed to save FCM token" });
  }
};

// forgot password

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    // Security best practice: do NOT reveal user existence
    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const resetUrl = `https://yourdomain.com/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your Dental App password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>
          <a href="${resetUrl}" style="padding:10px 20px;background:#1A73E8;color:white;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({
      success: true,
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Invalid request" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
