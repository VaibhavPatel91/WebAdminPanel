import productService from '../services/product.service.js';
import { success } from '../utils/response.js';

class ProductController {
  async create(req, res, next) {
    try {
      const { name, price, category } = req.body;
      const images = req.files ? req.files.map(file => file.path) : [];
      const product = await productService.createProduct({
        name,
        price,
        category,
        images
      });
      success(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const isPublic = req.query.public === 'true';
      const products = await productService.getAllProducts(isPublic);
      success(res, products, 'Products fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, category } = req.body;
      const updateData = { name, price, category };
      
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map(file => file.path);
      }
      
      const product = await productService.updateProduct(id, updateData);
      success(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      success(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();

