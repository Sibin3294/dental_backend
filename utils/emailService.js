const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Verify transporter on startup
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

/**
 * Generic send email
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Dental App 🦷" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log("📧 Email sent to:", to);
};

/**
 * Welcome email
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color:#1A73E8;">Welcome to Dental App 🦷</h2>
      <p>Hi <b>${user.name}</b>,</p>
      <p>Your account has been created successfully.</p>
      <p>You can now book appointments and manage your profile.</p>
      <br/>
      <p>— Dental App Team</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Welcome to Dental App 🦷",
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
