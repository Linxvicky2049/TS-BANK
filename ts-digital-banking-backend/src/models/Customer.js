const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    bvn: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },

    nin: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },

    verificationType: {
      type: String,
      enum: ["bvn", "nin"],
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);