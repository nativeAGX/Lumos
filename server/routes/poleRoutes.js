const express = require('express');
const router = express.Router();
const {
  getPoles,
  getPoleById,
  createPole,
  updatePole,
  deletePole,
  pingPoleTelemetry
} = require('../controllers/poleController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');

// GET /api/poles - Public / all authenticated roles
// POST /api/poles - Restricted to Ward Officer
router.route('/')
  .get(optionalProtect, getPoles)
  .post(protect, authorize('ward_officer'), createPole);

// GET /api/poles/:id - Public / all authenticated roles
// PUT, DELETE - Restricted to Ward Officer
router.route('/:id')
  .get(optionalProtect, getPoleById)
  .put(protect, authorize('ward_officer'), updatePole)
  .delete(protect, authorize('ward_officer'), deletePole);

// POST /api/poles/:id/ping - Restricted to Ward Officer and Field Tech
router.post('/:id/ping', protect, authorize('ward_officer', 'field_tech'), pingPoleTelemetry);

module.exports = router;
