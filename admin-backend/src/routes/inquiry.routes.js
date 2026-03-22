import express from 'express';
const router = express.Router();
import inquiryController from '../controllers/inquiry.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { inquirySchema } from '../validators/inquiry.validator.js';

// Public route to submit inquiry
router.post('/', validate(inquirySchema), inquiryController.create);

// Protected routes for admin
router.get('/', authMiddleware, inquiryController.getAll);
router.delete('/:id', authMiddleware, inquiryController.delete);

export default router;

