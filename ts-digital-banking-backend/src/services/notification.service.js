const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      String(process.env.SMTP_SECURE).toLowerCase() ===
      "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!to) {
    return;
  }

  const transporter =
    createTransporter();

  if (!transporter) {
    console.warn(
      "Email notification skipped: SMTP is not configured"
    );
    return;
  }

  await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

const sendOnboardingNotification = async ({
  emailAddress,
  fullName,
}) => {
  await sendEmail({
    to: emailAddress,
    subject: "TS Bank - KYC Verification Successful",
    text:
      `Hello ${fullName || "Customer"},\n\n` +
      "Your BVN/NIN verification was completed successfully.\n\n" +
      "You may now proceed with bank account creation.\n\n" +
      "TS Bank",
  });
};

const sendAccountCreatedNotification = async ({
  emailAddress,
  fullName,
  accountNumber,
  balance,
}) => {
  await sendEmail({
    to: emailAddress,
    subject: "TS Bank - Account Created",
    text:
      `Hello ${fullName || "Customer"},\n\n` +
      `Your TS Bank account has been created successfully.\n\n` +
      `Account Number: ${accountNumber}\n` +
      `Opening Balance: ₦${Number(balance).toLocaleString("en-NG")}\n\n` +
      "TS Bank",
  });
};

const sendTransferNotification = async ({
  emailAddress,
  fullName,
  amount,
  recipientAccountNumber,
  reference,
  status,
}) => {
  await sendEmail({
    to: emailAddress,
    subject: `TS Bank - Transfer ${status}`,
    text:
      `Hello ${fullName || "Customer"},\n\n` +
      `Your transfer of ₦${Number(amount).toLocaleString("en-NG")} ` +
      `to account ${recipientAccountNumber} is ${status}.\n\n` +
      `Reference: ${reference}\n\n` +
      "TS Bank",
  });
};

module.exports = {
  sendEmail,
  sendOnboardingNotification,
  sendAccountCreatedNotification,
  sendTransferNotification,
};