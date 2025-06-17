module.exports = (statusCode, message, errors) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors || [];
  throw error;
};
