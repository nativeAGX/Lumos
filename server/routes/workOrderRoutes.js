const express = require('express');
const router = express.Router();
const {
  getWorkOrders,
  getWorkOrderById,
  createWorkOrder,
  dispatchWorkOrder,
  approveAndCloseWorkOrder,
  rejectWorkOrder,
  deleteWorkOrder
} = require('../controllers/workOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All Work Order routes require authentication
router.use(protect);

// GET /api/work-orders - Viewable by Ward Officer and Field Tech
// POST /api/work-orders - Restricted to Ward Officer
router.route('/')
  .get(authorize('ward_officer', 'field_tech'), getWorkOrders)
  .post(authorize('ward_officer'), createWorkOrder);

// GET /api/work-orders/:id - Viewable by Ward Officer and Field Tech
// DELETE - Restricted to Ward Officer
router.route('/:id')
  .get(authorize('ward_officer', 'field_tech'), getWorkOrderById)
  .delete(authorize('ward_officer'), deleteWorkOrder);

// Dispatch & QA Sign-Off - Strictly Ward Officer
router.patch('/:id/dispatch', authorize('ward_officer'), dispatchWorkOrder);
router.patch('/:id/approve-close', authorize('ward_officer'), approveAndCloseWorkOrder);
router.patch('/:id/reject', authorize('ward_officer'), rejectWorkOrder);

module.exports = router;
