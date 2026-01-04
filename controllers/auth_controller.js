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

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

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

    res.status(201).json({
      success: true,
      message: "User registered & email sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
};

exports.saveFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  console.log("user id and fcmtoken");
  console.log(userId);
  console.log(fcmToken);
  await User.findByIdAndUpdate(userId, { fcmToken });

  res.json({ success: true });
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

    user.password = newPassword; // ⚠️ hash if you use bcrypt
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
