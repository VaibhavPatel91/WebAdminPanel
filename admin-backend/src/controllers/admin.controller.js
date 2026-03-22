import adminService from '../services/admin.service.js';
import { success } from '../utils/response.js';
import { NODE_ENV, JWT_COOKIE_EXPIRE } from '../config/env.js';

class AdminController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await adminService.login(username, password);
      
      const options = {
        expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('token', result.token, options);

      success(res, {
        admin: result.admin,
        token: result.token // Keeping it for backward compatibility if needed, but cookie is primary
      }, 'Login successful');
    } catch (error) {
      error.status = 401;
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      success(res, {}, 'Logged out successfully');
    } catch (error) {
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
