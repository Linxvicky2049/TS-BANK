const Account = require("../models/Account");
const Customer = require("../models/Customer");
const nibssService = require("./nibss.service");
const { toNibssDate } = require("../utils/nibssDate");

const createCustomerAccount = async (customer) => {
  if (!customer) {
    const error = new Error("Authenticated customer not found");
    error.statusCode = 401;
    throw error;
  }

  if (!customer.isVerified) {
    const error = new Error(
      "Customer must complete BVN or NIN verification before creating an account"
    );

    error.statusCode = 403;
    throw error;
  }

  const existingAccount = await Account.findOne({
    customer: customer._id,
  });

  if (existingAccount) {
    const error = new Error("Customer already has a bank account");
    error.statusCode = 409;
    throw error;
  }

  const verifiedCustomer = await Customer.findById(
    customer._id
  ).select("+bvn +nin");

  if (!verifiedCustomer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const verificationType =
    String(verifiedCustomer.verificationType || "").toLowerCase();

  let kycID;

  if (verificationType === "bvn") {
    kycID = verifiedCustomer.bvn;
  } else if (verificationType === "nin") {
    kycID = verifiedCustomer.nin;
  } else {
    const error = new Error(
      "Customer has no valid BVN or NIN verification type"
    );

    error.statusCode = 400;
    throw error;
  }

  if (!kycID) {
    const error = new Error(
      `Verified ${verificationType.toUpperCase()} identifier could not be found`
    );

    error.statusCode = 500;
    throw error;
  }

  const result = await nibssService.createAccount({
    kycType: verificationType,
    kycID,
    dob: toNibssDate(verifiedCustomer.dateOfBirth),
  });

  const accountNumber =
    result?.accountNumber ||
    result?.data?.accountNumber ||
    result?.account?.accountNumber;

  if (!accountNumber) {
    const error = new Error(
      "Nibss did not return an account number"
    );

    error.statusCode = 502;
    throw error;
  }

  const accountName =
    result?.accountName ||
    result?.data?.accountName ||
    verifiedCustomer.fullName;

  const bankName =
    result?.bankName ||
    result?.data?.bankName ||
    process.env.NIBSS_BANK_NAME ||
    "TS Bank";

  const account = await Account.create({
    customer: verifiedCustomer._id,
    accountNumber,
    accountName,
    bankName,
    balance: 15000,
    currency: "NGN",
    status: "ACTIVE",
    fundedAt: new Date(),
  });

  return account;
};

const getCustomerAccount = async (customerId) => {
  return Account.findOne({
    customer: customerId,
  });
};

module.exports = {
  createCustomerAccount,
  getCustomerAccount,
};
