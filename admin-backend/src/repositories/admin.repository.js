import Admin from '../models/admin.model.js';

class AdminRepository {
  async findByUsername(username) {
    return await Admin.findOne({ username }).select('+password');
  }

  async findById(id) {
    return await Admin.findById(id);
  }
}

export default new AdminRepository();
