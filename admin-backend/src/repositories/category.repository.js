import Category from '../models/category.model.js';

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async findAll(filter = {}) {
    return await Category.find(filter);
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async update(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }
}

export default new CategoryRepository();
