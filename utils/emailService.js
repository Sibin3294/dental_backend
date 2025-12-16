const nodemailer = require("nodemailer");

// Create transporter (use Gmail / SMTP / SendGrid later)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     // your email
    pass: process.env.EMAIL_PASSWORD, // app password
  },
});

/**
 * Generic send email function
 */
exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Dental App 🦷" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email error:", error);
  }
};

/**
 * Welcome email template
 */
exports.sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color:#1A73E8;">Welcome to Dental App 🦷</h2>
      <p>Hi <b>${user.name}</b>,</p>
      <p>
        Thank you for registering with <b>Dental App</b>.
        We're excited to take care of your dental health.
      </p>

      <p>
        You can now:
        <ul>
          <li>Book appointments easily</li>
          <li>Manage your profile</li>
          <li>Track your dental visits</li>
        </ul>
      </p>

      <p style="margin-top:20px;">
        Stay healthy and keep smiling 😊
      </p>

      <p>
        <b>Dental App Team</b>
      </p>
    </div>
  `;

  await exports.sendEmail({
    to: user.email,
    subject: "Welcome to Dental App 🦷",
    html,
  });
};
