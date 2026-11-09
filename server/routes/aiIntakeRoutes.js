const express = require('express');
const router = express.Router();
const {
  getIntakes,
  getIntakeById,
  reclassifyIntake,
  flagDuplicate,
  markFalseAlarm,
  approveToWorkOrder
} = require('../controllers/aiIntakeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All AI Intake routes require authentication
router.use(protect);

// GET /api/intakes - Operations viewable by Ward Officer and Field Tech
router.route('/')
  .get(authorize('ward_officer', 'field_tech'), getIntakes);

router.route('/:id')
  .get(authorize('ward_officer', 'field_tech'), getIntakeById);

// Triage Decision Actions - Strictly restricted to Ward Officer
router.patch('/:id/reclassify', authorize('ward_officer'), reclassifyIntake);
router.patch('/:id/duplicate', authorize('ward_officer'), flagDuplicate);
router.delete('/:id/false-alarm', authorize('ward_officer'), markFalseAlarm);
router.post('/:id/approve-work-order', authorize('ward_officer'), approveToWorkOrder);

module.exports = router;
