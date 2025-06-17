// utils/sendVerificationEmail.js
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

module.exports = async function sendVerificationEmail(email, token) {
  const verificationUrl = `https://ecniv-todo-list.netlify.app/auth/verify?token=${token}`;

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "TodoListApp - Verify your email",
    html: `
      <p>Thank you for registering!</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link is only valid for 2 hours.</p>
    `,
  };

  await sgMail.send(msg);
};
