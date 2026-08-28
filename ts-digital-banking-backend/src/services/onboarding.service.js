const Customer = require("../models/Customer");
const nibssService = require("./nibss.service");

const onboardCustomer = async ({
  fullName,
  email,
  phone,
  dateOfBirth,
  kycType,
  kycID,
}) => {
  if (!fullName || !email || !dateOfBirth || !kycType || !kycID) {
    const error = new Error(
      "fullName, email, dateOfBirth, kycType and kycID are required"
    );

    error.statusCode = 400;
    throw error;
  }

  const normalizedKycType = String(kycType).toLowerCase();

  if (!["bvn", "nin"].includes(normalizedKycType)) {
    const error = new Error("kycType must be BVN or NIN");

    error.statusCode = 400;
    throw error;
  }

  const existingCustomer = await Customer.findOne({
    $or: [{ email }, { phone }].filter(
      (condition) => Object.values(condition)[0]
    ),
  });

  if (existingCustomer) {
    const error = new Error("Customer already exists");

    error.statusCode = 409;
    throw error;
  }

  let verification;

  if (normalizedKycType === "bvn") {
    verification = await nibssService.validateBvn({
      bvn: kycID,
      dateOfBirth,
    });
  } else {
    verification = await nibssService.validateNin({
      nin: kycID,
      dateOfBirth,
    });
  }

  const customerData = {
    fullName,
    email,
    phone,
    dateOfBirth,
    verificationType: normalizedKycType,
    isVerified: true,
  };

  if (normalizedKycType === "bvn") {
    customerData.bvn = kycID;
  } else {
    customerData.nin = kycID;
  }

  const customer = await Customer.create(customerData);

  return {
    customer,
    verification,
  };
};

module.exports = {
  onboardCustomer,
};
