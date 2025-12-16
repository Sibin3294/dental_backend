const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/emailService");


// exports.register = async (req, res) => {
//     console.log("register api hit");
//   const { name, email, password } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   const user = new User({ name, email, password: hashed });
//   await user.save();

//   res.json({ message: "User registered" });
// };


exports.register = async (req, res) => {
  try {
    console.log("register api hit");

    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();

    // 🔥 Send welcome email
    sendWelcomeEmail(user); // non-blocking

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
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
