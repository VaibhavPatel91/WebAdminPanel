import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';

router.post('/login', validate(loginSchema), adminController.login);
router.post('/logout', authMiddleware, adminController.logout);
router.get('/me', authMiddleware, adminController.getMe);

export default router;

