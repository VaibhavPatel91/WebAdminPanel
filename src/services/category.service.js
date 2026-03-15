import categoryRepository from '../repositories/category.repository.js';

class CategoryService {
  async createCategory(data) {
    return await categoryRepository.create(data);
  }

  async getAllCategories(isPublic = false) {
    let categories;
    if (isPublic) {
      categories = await categoryRepository.findAll({});
      return categories.map(cat => ({ id: cat._id, name: cat.name }));
    }
    return await categoryRepository.findAll({});
  }

  async updateCategory(id, data) {
    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    return await categoryRepository.delete(id);
  }
}

export default new CategoryService();

