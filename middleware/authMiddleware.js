import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_interior');
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (req.admin.status === 'inactive') {
        return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
      }

      // Default role fallback for legacy documents
      if (!req.admin.role) {
        req.admin.role = 'admin';
      }

      req.user = req.admin;
      return next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.admin?.role || 'admin';
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: role '${userRole}' is not authorized to access this resource`
      });
    }
    next();
  };
};
