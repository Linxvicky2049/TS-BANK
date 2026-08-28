const crypto = require("crypto");

const generateReference = (prefix = "TSB") => {
  const timestamp = Date.now();

  const randomPart = crypto
    .randomBytes(8)
    .toString("hex")
    .toUpperCase();

  return `${prefix}-${timestamp}-${randomPart}`;
};

module.exports = {
  generateReference,
};