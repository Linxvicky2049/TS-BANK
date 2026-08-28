const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Account = require("../models/Account");
const nibssService = require("./nibss.service");

const processIntraBankTransfer = async ({
  senderAccount,
  recipientAccount,
  amount,
  narration,
}) => {
  const session =
    await mongoose.startSession();

  const reference =
    `TS-${uuidv4().replace(/-/g, "").slice(0, 20).toUpperCase()}`;

  try {
    let result;

    await session.withTransaction(async () => {
      const freshSender =
        await Account.findOne({
          _id: senderAccount._id,
          status: "ACTIVE",
        }).session(session);

      const freshRecipient =
        await Account.findOne({
          _id: recipientAccount._id,
          status: "ACTIVE",
        }).session(session);

      if (!freshSender) {
        const error = new Error(
          "Sender account not found"
        );
        error.statusCode = 404;
        throw error;
      }

      if (!freshRecipient) {
        const error = new Error(
          "Recipient account not found"
        );
        error.statusCode = 404;
        throw error;
      }

      if (
        Number(freshSender.balance) < amount
      ) {
        const error = new Error(
          "Insufficient funds"
        );
        error.statusCode = 400;
        throw error;
      }

      const balanceBefore =
        Number(freshSender.balance);

      freshSender.balance -= amount;
      freshRecipient.balance += amount;

      await freshSender.save({
        session,
      });

      await freshRecipient.save({
        session,
      });

      result = {
        reference,
        balanceBefore,
        balanceAfter:
          Number(freshSender.balance),
        status: "SUCCESS",
        narration:
          narration || "Intra-bank transfer",
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

const processInterBankTransfer = async ({
  senderAccount,
  recipientAccountNumber,
  recipientBankCode,
  amount,
  narration,
}) => {
  if (!recipientBankCode) {
    const error = new Error(
      "Recipient bank code is required for inter-bank transfers"
    );

    error.statusCode = 400;
    throw error;
  }

  const balanceBefore =
    Number(senderAccount.balance);

  if (balanceBefore < amount) {
    const error = new Error(
      "Insufficient funds"
    );

    error.statusCode = 400;
    throw error;
  }

  const reference =
    `TS-${uuidv4().replace(/-/g, "").slice(0, 20).toUpperCase()}`;

  const result =
    await nibssService.transfer({
      from: senderAccount.accountNumber,
      to: recipientAccountNumber,
      amount,
    });

  const successful =
    result?.success === true ||
    String(result?.status).toUpperCase() ===
      "SUCCESS" ||
    String(result?.data?.status).toUpperCase() ===
      "SUCCESS";

  if (!successful) {
    const error = new Error(
      "Inter-bank transfer failed"
    );

    error.statusCode = 502;
    error.nibssResponse = result;

    throw error;
  }

  senderAccount.balance -= amount;
  await senderAccount.save();

  return {
    reference:
      result?.reference ||
      result?.data?.reference ||
      reference,
    balanceBefore,
    balanceAfter:
      Number(senderAccount.balance),
    status: "SUCCESS",
    narration:
      narration || "Inter-bank transfer",
  };
};

module.exports = {
  processIntraBankTransfer,
  processInterBankTransfer,
};