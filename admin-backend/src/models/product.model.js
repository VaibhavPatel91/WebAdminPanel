import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  images: [
    {
      type: String,
      required: [true, 'At least one image is required'],
    }
  ],
  is_online: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;

