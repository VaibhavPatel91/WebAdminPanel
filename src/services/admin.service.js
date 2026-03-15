import jwt from 'jsonwebtoken';
import adminRepository from '../repositories/admin.repository.js';
import { JWT_SECRET } from '../config/env.js';

class AdminService {
  async login(username, password) {
    const admin = await adminRepository.findByUsername(username);

    if (!admin || !(await admin.matchPassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(admin._id);

    return {
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      token,
    };
  }

  generateToken(id) {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  async getAdminProfile(id) {
    return await adminRepository.findById(id);
  }
}

export default new AdminService();
