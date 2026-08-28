const crypto = require("crypto");

const generateAccountNumber = () => {
  const randomPart = crypto
    .randomInt(100000000, 1000000000)
    .toString();

  return randomPart;
};

const isValidAccountNumber = (accountNumber) => {
  return /^\d{10}$/.test(String(accountNumber));
};

module.exports = {
  generateAccountNumber,
  isValidAccountNumber,
};