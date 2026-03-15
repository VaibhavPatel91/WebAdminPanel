import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import errorMiddleware from './middlewares/error.middleware.js';
import logger from './utils/logger.js';

import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import productRoutes from './routes/product.routes.js';

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/products', productRoutes);

// Static files
app.use('/uploads', express.static('uploads'));

// Error Handling
app.use(errorMiddleware);

export default app;

