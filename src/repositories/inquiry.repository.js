import Inquiry from '../models/inquiry.model.js';

class InquiryRepository {
  async create(data) {
    return await Inquiry.create(data);
  }

  async findAll(filter = {}) {
    return await Inquiry.find(filter).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Inquiry.findById(id);
  }

  async delete(id) {
    return await Inquiry.findByIdAndDelete(id);
  }
}

export default new InquiryRepository();

