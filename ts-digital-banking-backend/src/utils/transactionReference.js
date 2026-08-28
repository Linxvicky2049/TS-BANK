const crypto = require("crypto");

const generateTransactionReference = (prefix = "TSB") => {
  const timestamp = Date.now();

  const randomPart = crypto
    .randomBytes(8)
    .toString("hex")
    .toUpperCase();

  return `${prefix}-${timestamp}-${randomPart}`;
};

const isValidTransactionReference = (reference) => {
  return /^TSB-\d+-[A-F0-9]+$/.test(String(reference));
};

module.exports = {
  generateTransactionReference,
  isValidTransactionReference,
};