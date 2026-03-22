import express from 'express';
const router = express.Router();
import categoryController from '../controllers/category.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { categorySchema } from '../validators/category.validator.js';

// Public route with conditional auth
router.get('/', (req, res, next) => {
    if (req.query.public === 'true') {
        return next();
    }
    return authMiddleware(req, res, next);
}, categoryController.getAll);

router.post('/', authMiddleware, upload.single('image'), validate(categorySchema), categoryController.create);
router.put('/:id', authMiddleware, upload.single('image'), validate(categorySchema), categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

export default router;

