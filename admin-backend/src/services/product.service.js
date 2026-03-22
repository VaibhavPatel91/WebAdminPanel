import productRepository from '../repositories/product.repository.js';

class ProductService {
  async createProduct(data) {
    return await productRepository.create(data);
  }

  async getAllProducts(isPublic = false) {
    let products;
    if (isPublic) {
      products = await productRepository.findAll({ is_online: true });
      return products.map(prod => ({
        id: prod._id,
        name: prod.name,
        images: prod.images,
        category: prod.category ? {
          id: prod.category._id,
          name: prod.category.name
        } : null
      }));
    }
    return await productRepository.findAll({});
  }

  async getProductById(id) {
    return await productRepository.findById(id);
  }

  async updateProduct(id, data) {
    return await productRepository.update(id, data);
  }

  async deleteProduct(id) {
    return await productRepository.delete(id);
  }
}

export default new ProductService();

