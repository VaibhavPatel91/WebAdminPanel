import express from 'express';
const router = express.Router();
import dashboardController from '../controllers/dashboard.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

router.get('/test', (req, res) => res.json({ message: 'Dashboard router is reached' }));
router.get('/stats', authMiddleware, dashboardController.getStats);

export default router;
