const express = require("express");

const {
  verifyBvn,
  verifyNin,
  getOnboardingStatus,
} = require("../controllers/onboarding.controller");

const { protect } = require("../middleware/auth.middleware");

const validate = require("../middleware/validation.middleware");

const {
  bvnSchema,
  ninSchema,
} = require("../validators/onboarding.validator");

const router = express.Router();

router.use(protect);

router.post(
  "/bvn",
  validate(bvnSchema),
  verifyBvn
);

router.post(
  "/nin",
  validate(ninSchema),
  verifyNin
);

router.get(
  "/status",
  getOnboardingStatus
);

module.exports = router;