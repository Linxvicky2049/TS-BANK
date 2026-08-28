const successResponse = (
  res,
  {
    statusCode = 200,
    message = "Request successful",
    data = null,
  } = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (
  res,
  {
    statusCode = 500,
    message = "Internal server error",
  } = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};