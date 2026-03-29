const errorHandler = (err, req, res, next) => {
  // If the status code is 200 (default), change it to 500, otherwise keep it
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);

  res.json({
    message: err.message,
    // Add stack trace only if not in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
