const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getUsers
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);

// Private profile route
router.get('/me', protect, getMe);

// Directory route - Strictly protected & restricted to Ward Officer
router.get('/users', protect, authorize('ward_officer'), getUsers);

module.exports = router;
