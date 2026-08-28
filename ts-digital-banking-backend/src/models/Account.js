const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
      index: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 10,
      maxlength: 10,
    },

    accountName: {
      type: String,
      required: true,
      trim: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    balance: {
      type: Number,
      required: true,
      default: 15000,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN"],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "CLOSED"],
      default: "ACTIVE",
    },

    fundedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);