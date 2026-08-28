const express = require("express");

const {
  nameEnquiry,
  createTransfer,
} = require("../controllers/transfer.controller");

const { protect } = require("../middleware/auth.middleware");

const validate = require("../middleware/validation.middleware");

const {
  transferSchema,
} = require("../validators/transfer.validator");

const router = express.Router();

router.use(protect);

router.get(
  "/name-enquiry/:accountNumber",
  nameEnquiry
);

router.post(
  "/",
  validate(transferSchema),
  createTransfer
);

module.exports = router;