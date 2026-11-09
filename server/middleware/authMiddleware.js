const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verifies JWT token from Authorization header
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Access token missing. Please provide a valid Bearer token.'
    });
  }

  // Ensure JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server error: JWT_SECRET environment variable is not configured.'
    });
  }

  try {
    // Verify token strictly with JWT_SECRET (no fallback)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID or email from decoded payload
    const user = await User.findOne({
      $or: [{ id: decoded.id }, { email: decoded.email }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account linked to this token no longer exists.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired: JWT token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid or malformed token.'
    });
  }
};

// Grant access to specific roles (Role-Based Access Control - RBAC)
// Supported roles: 'ward_officer', 'field_tech', 'citizen'
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking role permissions.'
      });
    }

    const userRole = req.user.role || req.user.roleKey;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${userRole}' is not authorized to perform this action. Required role(s): [${roles.join(', ')}]`
      });
    }

    next();
  };
};

// Optional auth - If token is provided, populates req.user, otherwise continues as guest
exports.optionalProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || !process.env.JWT_SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      $or: [{ id: decoded.id }, { email: decoded.email }]
    });
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Continue without user
  }
  next();
};

