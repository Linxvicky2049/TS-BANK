const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "TRANSFER",
        "FUNDING",
        "REVERSAL",
      ],
      required: true,
    },

    direction: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    narration: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    sourceAccount: {
      type: String,
      trim: true,
    },

    destinationAccount: {
      type: String,
      trim: true,
    },

    recipientName: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "SUCCESS",
        "SUCCESSFUL",
        "COMPLETED",
        "FAILED",
        "REVERSED",
      ],
      default: "PENDING",
      index: true,
    },

    failureReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({
  customer: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);