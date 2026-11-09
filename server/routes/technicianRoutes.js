const express = require('express');
const router = express.Router();
const {
  getTechnicianQueue,
  toggleChecklistItem,
  setProofAfter,
  submitProofAndClose,
  updateInventoryStock
} = require('../controllers/technicianController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Entire /api/technician router is strictly restricted to Field Technicians ('field_tech')
router.use(protect);
router.use(authorize('field_tech'));

router.get('/queue', getTechnicianQueue);
router.patch('/checklist/:checkId', toggleChecklistItem);
router.patch('/proof-after', setProofAfter);
router.post('/submit-job', submitProofAndClose);
router.patch('/inventory/:itemId', updateInventoryStock);

module.exports = router;
