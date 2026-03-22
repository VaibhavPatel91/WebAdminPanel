import inquiryService from '../services/inquiry.service.js';
import { success } from '../utils/response.js';

class InquiryController {
  async create(req, res, next) {
    try {
      const inquiry = await inquiryService.createInquiry(req.body);
      success(res, inquiry, 'Inquiry submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { search, startDate, endDate } = req.query;
      const inquiries = await inquiryService.getAllInquiries(search, startDate, endDate);
      success(res, inquiries, 'Inquiries fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await inquiryService.deleteInquiry(id);
      success(res, null, 'Inquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new InquiryController();

