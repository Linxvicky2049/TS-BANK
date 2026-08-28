const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.NIBSS_BASE_URL;

if (!BASE_URL) {
  throw new Error("NIBSS_BASE_URL is not configured");
}

let cachedToken = null;
let tokenExpiresAt = 0;

const TOKEN_CACHE_BUFFER = 60 * 1000;

const getNibssToken = async () => {
  if (
    cachedToken &&
    Date.now() < tokenExpiresAt - TOKEN_CACHE_BUFFER
  ) {
    return cachedToken;
  }

  const apiKey = process.env.NIBSS_API_KEY;
  const apiSecret = process.env.NIBSS_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "NIBSS API credentials are not configured"
    );
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/token`,
      {
        apiKey,
        apiSecret,
      },
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const token =
      response.data?.token ||
      response.data?.accessToken ||
      response.data?.data?.token;

    if (!token) {
      throw new Error(
        "NIBSS authentication response did not contain a token"
      );
    }

    cachedToken = token;

    const expiresIn =
      Number(response.data?.expiresIn) ||
      Number(response.data?.data?.expiresIn) ||
      2700;

    tokenExpiresAt =
      Date.now() + expiresIn * 1000;

    return cachedToken;
  } catch (error) {
    cachedToken = null;
    tokenExpiresAt = 0;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unable to authenticate with NIBSS";

    const authError = new Error(
      `NIBSS authentication failed: ${message}`
    );

    authError.statusCode =
      error.response?.status || 502;

    authError.nibssResponse =
      error.response?.data;

    throw authError;
  }
};

const getNibssHeaders = async () => {
  const token = await getNibssToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.NIBSS_API_KEY,
  };
};

const clearNibssToken = () => {
  cachedToken = null;
  tokenExpiresAt = 0;
};

module.exports = {
  BASE_URL,
  getNibssToken,
  getNibssHeaders,
  clearNibssToken,
};