const express = require("express");

const {
  getMyTransactions,
  getMyTransaction,
} = require("../controllers/transaction.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  getMyTransactions
);

router.get(
  "/:ref",
  getMyTransaction
);

module.exports = router;