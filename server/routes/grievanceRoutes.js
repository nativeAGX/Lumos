const express = require('express');
const router = express.Router();
const {
  getGrievances,
  getGrievanceById,
  createGrievance,
  updateGrievanceStatus
} = require('../controllers/grievanceController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');

// GET /api/grievances - Public / Citizen tracking
// POST /api/grievances - Any user (Citizen or Ward Officer)
router.route('/')
  .get(optionalProtect, getGrievances)
  .post(optionalProtect, createGrievance);

router.route('/:id')
  .get(optionalProtect, getGrievanceById);

// PATCH /api/grievances/:id/status - Restricted to Ward Officer and Field Tech
router.patch(
  '/:id/status',
  protect,
  authorize('ward_officer', 'field_tech'),
  updateGrievanceStatus
);

module.exports = router;
