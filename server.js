import app from './src/app.js';
import { PORT, NODE_ENV } from './src/config/env.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';

// Connect to Database
connectDB();

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

