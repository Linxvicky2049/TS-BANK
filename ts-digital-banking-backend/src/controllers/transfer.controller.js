const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Customer = require("../models/Customer");

const nibssService = require("../services/nibss.service");
const transferService = require("../services/transfer.service");
const notificationService = require("../services/notification.service");

const nameEnquiry = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Account number is required",
      });
    }

    const result = await nibssService.nameEnquiry(
      accountNumber
    );

    return res.status(200).json({
      success: true,
      message: "Account name enquiry successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createTransfer = async (req, res, next) => {
  try {
    const {
      recipientAccountNumber,
      recipientBankCode,
      amount,
      narration,
    } = req.body;

    if (
      !recipientAccountNumber ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Recipient account number and amount are required",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    const senderAccount =
      await Account.findOne({
        customer: req.user._id,
        status: "ACTIVE",
      });

    if (!senderAccount) {
      return res.status(404).json({
        success: false,
        message: "Active bank account not found",
      });
    }

    if (
      senderAccount.accountNumber ===
      recipientAccountNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to the same account",
      });
    }

    if (
      Number(senderAccount.balance) <
      Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds",
      });
    }

    const enquiry =
      await nibssService.nameEnquiry(
        recipientAccountNumber
      );

    const recipientName =
      enquiry?.accountName ||
      enquiry?.data?.accountName ||
      enquiry?.account?.accountName ||
      enquiry?.name ||
      enquiry?.data?.name;

    if (!recipientName) {
      return res.status(400).json({
        success: false,
        message:
          "Recipient account could not be verified",
      });
    }

    const recipientAccount =
      await Account.findOne({
        accountNumber: recipientAccountNumber,
        status: "ACTIVE",
      });

    let transferResult;

    if (recipientAccount) {
      transferResult =
        await transferService.processIntraBankTransfer({
          senderAccount,
          recipientAccount,
          amount: Number(amount),
          narration,
        });
    } else {
      transferResult =
        await transferService.processInterBankTransfer({
          senderAccount,
          recipientAccountNumber,
          recipientBankCode,
          amount: Number(amount),
          narration,
        });
    }

    const transaction =
      await Transaction.create({
        customer: req.user._id,
        account: senderAccount._id,
        reference:
          transferResult.reference,
        type: "TRANSFER",
        direction: "DEBIT",
        amount: Number(amount),
        balanceBefore: transferResult.balanceBefore,
        balanceAfter: transferResult.balanceAfter,
        recipientAccountNumber,
        recipientAccountName: recipientName,
        recipientBankCode:
          recipientBankCode || null,
        narration:
          narration || "Funds transfer",
        status:
          transferResult.status || "SUCCESS",
      });

    try {
      const customer =
        await Customer.findById(req.user._id);

      await notificationService.sendTransferNotification({
        emailAddress: customer?.email,
        fullName: customer?.fullName,
        amount: Number(amount),
        recipientAccountNumber,
        reference: transaction.reference,
        status: transaction.status,
      });
    } catch (notificationError) {
      console.error(
        "Transfer notification failed:",
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Transfer processed successfully",
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  nameEnquiry,
  createTransfer,
};