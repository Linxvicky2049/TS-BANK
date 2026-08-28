const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const accountRoutes = require("./routes/account.routes");
const transferRoutes = require("./routes/transfer.routes");
const transactionRoutes = require("./routes/transaction.routes");

const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(morgan("dev"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);

app.use(
  "/api/onboarding",
  onboardingRoutes
);

app.use(
  "/api/accounts",
  accountRoutes
);

app.use(
  "/api/transfers",
  transferRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TS-BANK API is running",
    timestamp:
      new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;