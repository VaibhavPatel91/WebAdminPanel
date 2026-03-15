import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import Admin from '../models/admin.model.js';

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    
    if (!req.admin) {
        return res.status(401).json({
            success: false,
            message: 'Admin not found',
        });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

export default authMiddleware;
