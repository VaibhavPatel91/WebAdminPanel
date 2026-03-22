import Product from '../models/product.model.js';

class ProductRepository {
  async create(data) {
    return await Product.create(data);
  }

  async findAll(filter = {}) {
    return await Product.find(filter).populate('category', 'name');
  }

  async findById(id) {
    return await Product.findById(id).populate('category', 'name');
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();

