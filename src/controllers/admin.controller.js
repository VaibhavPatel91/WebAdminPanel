import adminService from '../services/admin.service.js';
import { success } from '../utils/response.js';

class AdminController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await adminService.login(username, password);
      success(res, result, 'Login successful');
    } catch (error) {
      error.status = 401;
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const admin = await adminService.getAdminProfile(req.admin.id);
      success(res, admin, 'Admin profile fetched');
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
