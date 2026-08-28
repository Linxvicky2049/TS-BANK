const axios = require("axios");
const {
  BASE_URL,
  getNibssHeaders,
  clearNibssToken,
} = require("../config/nibss");

const nibssClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const request = async ({
  method,
  path,
  data,
  params,
}) => {
  if (!path) {
    throw new Error(
      "NIBSS endpoint path is not configured"
    );
  }

  const headers = await getNibssHeaders();

  try {
    const response = await nibssClient.request({
      method,
      url: path,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      clearNibssToken();
    }

    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "NIBSS request failed";

    const nibssError = new Error(message);

    nibssError.statusCode = status || 502;
    nibssError.nibssResponse =
      error.response?.data;

    throw nibssError;
  }
};

const insertBvn = (payload) =>
  request({
    method: "POST",
    path: process.env.NIBSS_BVN_INSERT_PATH,
    data: payload,
  });

const validateBvn = (payload) =>
  request({
    method: "POST",
    path: process.env.NIBSS_BVN_VALIDATE_PATH,
    data: payload,
  });

const insertNin = (payload) =>
  request({
    method: "POST",
    path: process.env.NIBSS_NIN_INSERT_PATH,
    data: payload,
  });

const validateNin = (payload) =>
  request({
    method: "POST",
    path: process.env.NIBSS_NIN_VALIDATE_PATH,
    data: payload,
  });

const createAccount = (payload) =>
  request({
    method: "POST",
    path: process.env.NIBSS_ACCOUNT_CREATE_PATH,
    data: payload,
  });

const nameEnquiry = (accountNumber) =>
  request({
    method: "GET",
    path: `${process.env.NIBSS_NAME_ENQUIRY_PATH}/${encodeURIComponent(
      accountNumber
    )}`,
  });

const transfer = (payload) =>
  request({
    method: "POST",
    path: process.env.NIBSS_TRANSFER_PATH,
    data: payload,
  });

const getTransaction = (reference) =>
  request({
    method: "GET",
    path: `${process.env.NIBSS_TRANSACTION_STATUS_PATH}/${encodeURIComponent(
      reference
    )}`,
  });

const getAccounts = () =>
  request({
    method: "GET",
    path: process.env.NIBSS_ACCOUNTS_PATH,
  });

const getBalance = (accountNumber) =>
  request({
    method: "GET",
    path: `${process.env.NIBSS_BALANCE_PATH}/${encodeURIComponent(
      accountNumber
    )}`,
  });

module.exports = {
  insertBvn,
  validateBvn,
  insertNin,
  validateNin,
  createAccount,
  nameEnquiry,
  transfer,
  getTransaction,
  getAccounts,
  getBalance,
};