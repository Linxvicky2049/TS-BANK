const Transaction = require("../models/Transaction");

const getCustomerTransactions = async ({
  customerId,
  page = 1,
  limit = 20,
}) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(
    Math.max(parseInt(limit, 10) || 20, 1),
    100
  );

  const skip = (safePage - 1) * safeLimit;

  const filter = {
    customer: customerId,
  };

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
};

const getCustomerTransactionByReference = async ({
  customerId,
  reference,
}) => {
  return Transaction.findOne({
    customer: customerId,
    reference,
  }).lean();
};

module.exports = {
  getCustomerTransactions,
  getCustomerTransactionByReference,
};