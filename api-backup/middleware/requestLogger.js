const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log when the request finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
};

module.exports = requestLogger;
