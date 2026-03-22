import inquiryRepository from '../repositories/inquiry.repository.js';

class InquiryService {
  async createInquiry(data) {
    return await inquiryRepository.create(data);
  }

  async getAllInquiries(search, startDate, endDate) {
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    return await inquiryRepository.findAll(filter);
  }

  async deleteInquiry(id) {
    return await inquiryRepository.delete(id);
  }
}

export default new InquiryService();

