const {
  createCustomerAccount,
  getCustomerAccount,
} = require("../services/account.service");

const notificationService = require("../services/notification.service");

const createAccount = async (req, res, next) => {
  try {
    const account =
      await createCustomerAccount(req.user);

    try {
      await notificationService.sendAccountCreatedNotification({
        emailAddress: req.user.email,
        fullName: req.user.fullName,
        accountNumber: account.accountNumber,
        balance: account.balance,
      });
    } catch (notificationError) {
      console.error(
        "Account creation email failed:",
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Bank account created successfully",
      data: {
        account: {
          id: account._id,
          accountNumber: account.accountNumber,
          accountName: account.accountName,
          bankName: account.bankName,
          balance: account.balance,
          currency: account.currency,
          status: account.status,
          createdAt: account.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyAccount = async (req, res, next) => {
  try {
    const account =
      await getCustomerAccount(req.user._id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        account: {
          id: account._id,
          accountNumber: account.accountNumber,
          accountName: account.accountName,
          bankName: account.bankName,
          balance: account.balance,
          currency: account.currency,
          status: account.status,
          createdAt: account.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBalance = async (req, res, next) => {
  try {
    const account =
      await getCustomerAccount(req.user._id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        currency: account.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAccount,
  getMyAccount,
  getBalance,
};
