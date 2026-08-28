const Customer = require("../models/Customer");
const nibssService = require("../services/nibss.service");
const notificationService = require("../services/notification.service");
const { toNibssDate } = require("../utils/nibssDate");

const verifyBvn = async (req, res, next) => {
  try {
    const {
      bvn,
      firstName,
      lastName,
      phone,
    } = req.body;

    if (!bvn || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "BVN, first name, last name and phone are required",
      });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await nibssService.insertBvn({
      bvn,
      firstName,
      lastName,
      dob: toNibssDate(customer.dateOfBirth),
      phone,
    });

    const validationResult =
      await nibssService.validateBvn({
        bvn,
        dateOfBirth: toNibssDate(customer.dateOfBirth),
      });

    const verificationSucceeded =
      validationResult?.success === true ||
      validationResult?.verified === true ||
      String(validationResult?.status).toUpperCase() === "SUCCESS" ||
      validationResult?.data?.verified === true ||
      String(validationResult?.data?.status).toUpperCase() ===
        "SUCCESS";

    if (!verificationSucceeded) {
      return res.status(400).json({
        success: false,
        message: "BVN verification failed",
        data: validationResult,
      });
    }

    const updatedCustomer =
      await Customer.findByIdAndUpdate(
        req.user._id,
        {
          bvn,
          verificationType: "bvn",
          isVerified: true,
          verifiedAt: new Date(),
        },
        {
          new: true,
        }
      );

    try {
      await notificationService.sendOnboardingNotification({
        emailAddress: updatedCustomer.email,
        fullName: updatedCustomer.fullName,
      });
    } catch (notificationError) {
      console.error(
        "Onboarding email failed:",
        notificationError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "BVN verification successful",
      data: {
        verified: updatedCustomer.isVerified,
        verificationType: updatedCustomer.verificationType,
        verifiedAt: updatedCustomer.verifiedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyNin = async (req, res, next) => {
  try {
    const {
      nin,
      firstName,
      lastName,
    } = req.body;

    if (!nin || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message:
          "NIN, first name and last name are required",
      });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await nibssService.insertNin({
      nin,
      firstName,
      lastName,
      dob: toNibssDate(customer.dateOfBirth),
    });

    const validationResult =
      await nibssService.validateNin({
        nin,
        dateOfBirth: toNibssDate(customer.dateOfBirth),
      });

    const verificationSucceeded =
      validationResult?.success === true ||
      validationResult?.verified === true ||
      String(validationResult?.status).toUpperCase() === "SUCCESS" ||
      validationResult?.data?.verified === true ||
      String(validationResult?.data?.status).toUpperCase() ===
        "SUCCESS";

    if (!verificationSucceeded) {
      return res.status(400).json({
        success: false,
        message: "NIN verification failed",
        data: validationResult,
      });
    }

    const updatedCustomer =
      await Customer.findByIdAndUpdate(
        req.user._id,
        {
          nin,
          verificationType: "nin",
          isVerified: true,
          verifiedAt: new Date(),
        },
        {
          new: true,
        }
      );

    try {
      await notificationService.sendOnboardingNotification({
        emailAddress: updatedCustomer.email,
        fullName: updatedCustomer.fullName,
      });
    } catch (notificationError) {
      console.error(
        "Onboarding email failed:",
        notificationError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "NIN verification successful",
      data: {
        verified: updatedCustomer.isVerified,
        verificationType: updatedCustomer.verificationType,
        verifiedAt: updatedCustomer.verifiedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOnboardingStatus = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        isVerified: customer.isVerified,
        verificationType: customer.verificationType,
        verifiedAt: customer.verifiedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyBvn,
  verifyNin,
  getOnboardingStatus,
};