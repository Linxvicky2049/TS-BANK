const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  const statusCode =
    error.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  };

  if (
    process.env.NODE_ENV ===
    "development"
  ) {
    response.stack = error.stack;
  }

  return res
    .status(statusCode)
    .json(response);
};

module.exports = errorHandler;