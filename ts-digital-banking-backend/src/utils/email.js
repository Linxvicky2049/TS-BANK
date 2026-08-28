const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error(
      "SMTP configuration is missing"
    );
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
};

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  const mailer = getTransporter();

  return mailer.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
};