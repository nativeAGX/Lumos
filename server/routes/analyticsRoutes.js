const express = require('express');
const router = express.Router();
const { getAnalytics, exportAuditReport } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// SLA Analytics & Audit Export - Restricted to Ward Officer
router.use(protect);
router.use(authorize('ward_officer'));

router.get('/', getAnalytics);
router.get('/export', exportAuditReport);

module.exports = router;
