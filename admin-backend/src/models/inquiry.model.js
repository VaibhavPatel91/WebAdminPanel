import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;

