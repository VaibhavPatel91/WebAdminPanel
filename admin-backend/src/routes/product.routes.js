import express from 'express';
const router = express.Router();
import productController from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { productSchema } from '../validators/product.validator.js';

// Public route with conditional auth
router.get('/', (req, res, next) => {
    if (req.query.public === 'true') {
        return next();
    }
    return authMiddleware(req, res, next);
}, productController.getAll);

router.post('/', authMiddleware, upload.array('images', 10), validate(productSchema), productController.create);
router.put('/:id', authMiddleware, upload.array('images', 10), validate(productSchema), productController.update);
router.delete('/:id', authMiddleware, productController.delete);

export default router;

