const Transaction = require("../models/Transaction");
const nibssService = require("../services/nibss.service");

const getMyTransactions = async (
  req,
  res,
  next
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {
      customer: req.user._id,
    };

    const [
      transactions,
      total,
    ] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyTransaction = async (
  req,
  res,
  next
) => {
  try {
    const { ref } = req.params;

    const transaction =
      await Transaction.findOne({
        reference: ref,
        customer: req.user._id,
      });

    if (transaction) {
      return res.status(200).json({
        success: true,
        data: {
          transaction,
        },
      });
    }

    const nibssTransaction =
      await nibssService.getTransaction(ref);

    if (!nibssTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        transaction: nibssTransaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTransactions,
  getMyTransaction,
};