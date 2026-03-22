import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Inquiry from '../models/inquiry.model.js';
import { success } from '../utils/response.js';

class DashboardController {
  async getStats(req, res, next) {
    try {
      const productCount = await Product.countDocuments();
      const categoryCount = await Category.countDocuments();
      const inquiryCount = await Inquiry.countDocuments();

      // Get count of products per category
      const categoryStats = await Category.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            productCount: { $size: '$products' }
          }
        },
        { $sort: { productCount: -1 } }
      ]);

      success(res, {
        totalProducts: productCount,
        totalCategories: categoryCount,
        totalInquiries: inquiryCount,
        categoryStats
      }, 'Dashboard statistics fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
