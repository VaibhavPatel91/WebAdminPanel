import logger from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
  });
};

export default errorMiddleware;
