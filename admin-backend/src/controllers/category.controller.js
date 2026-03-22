import categoryService from '../services/category.service.js';
import { success } from '../utils/response.js';

class CategoryController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const image = req.file ? req.file.path : null;
      const category = await categoryService.createCategory({ name, image });
      success(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const isPublic = req.query.public === 'true';
      const categories = await categoryService.getAllCategories(isPublic);
      success(res, categories, 'Categories fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updateData = { name };
      if (req.file) {
        updateData.image = req.file.path;
      }
      const category = await categoryService.updateCategory(id, updateData);
      success(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      success(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();

