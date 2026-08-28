const express = require("express");

const {
  createAccount,
  getMyAccount,
  getBalance,
} = require("../controllers/account.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createAccount
);

router.get(
  "/me",
  protect,
  getMyAccount
);

router.get(
  "/balance",
  protect,
  getBalance
);

module.exports = router;