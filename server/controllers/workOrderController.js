const WorkOrder = require('../models/WorkOrder');
const Grievance = require('../models/Grievance');

// @desc    Get all work orders with filters
// @route   GET /api/work-orders
exports.getWorkOrders = async (req, res) => {
  try {
    const { column, priority, crew, search } = req.query;
    let query = {};

    if (column && column !== 'ALL') {
      query.column = column;
    }

    if (priority && priority !== 'ALL') {
      query.priorityLevel = priority;
    }

    if (crew && crew !== 'ALL') {
      query.assignedCrewId = crew;
    }

    if (search) {
      query.$or = [
        { id: new RegExp(search, 'i') },
        { poleId: new RegExp(search, 'i') },
        { poleTag: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { technicianName: new RegExp(search, 'i') },
        { circuitZone: new RegExp(search, 'i') }
      ];
    }

    const workOrders = await WorkOrder.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: workOrders.length, data: workOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single work order by ID
// @route   GET /api/work-orders/:id
exports.getWorkOrderById = async (req, res) => {
  try {
    const wo = await WorkOrder.findOne({ id: req.params.id });
    if (!wo) {
      return res.status(404).json({ success: false, message: `Work Order ${req.params.id} not found` });
    }
    res.json({ success: true, data: wo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new maintenance work order
// @route   POST /api/work-orders
exports.createWorkOrder = async (req, res) => {
  try {
    const body = req.body;
    const woId = body.id || `WO-2026-${Math.floor(895 + Math.random() * 90)}`;
    const cleanPole = (body.poleId || 'LUM-W12-1049').replace('#', '').trim();

    const created = await WorkOrder.create({
      id: woId,
      poleId: cleanPole,
      poleTag: `#${cleanPole}`,
      title: body.title || 'Luminaire Hardware Inspection',
      description: body.description || 'Routine circuit check and component overhaul.',
      priority: body.priority || 'MEDIUM PRIORITY',
      priorityLevel: body.priorityLevel || 'MEDIUM',
      column: 'TO_DISPATCH',
      slaTimeLeft: body.priorityLevel === 'CRITICAL' ? '2h 30m left' : '16h 00m left',
      circuitZone: body.circuitZone || 'Feeder C4 • Somaiya',
      assignedCrewId: body.crewId || '07',
      assignedCrewName: `Crew #${body.crewId || '07'} (${body.crewName || 'Available'})`,
      technicianName: body.technicianName || 'Rajesh Kumar',
      vehicleNumber: 'MH-03-EB-4109',
      voltage: '230V',
      urgent: body.priorityLevel === 'CRITICAL',
      tags: [body.priorityLevel || 'MEDIUM', 'Manual Order']
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dispatch crew for work order
// @route   PATCH /api/work-orders/:id/dispatch
exports.dispatchWorkOrder = async (req, res) => {
  try {
    const { crewName = 'Crew #07 • Rajesh K.' } = req.body;
    const wo = await WorkOrder.findOne({ id: req.params.id });
    if (!wo) {
      return res.status(404).json({ success: false, message: `Work Order ${req.params.id} not found` });
    }

    wo.column = 'IN_PROGRESS';
    wo.statusBadge = 'En Route';
    wo.crewBadge = crewName;
    wo.crewInitials = 'RK';
    wo.vehicle = 'MH-03-EB-4109';
    wo.gpsEta = '6 mins';
    wo.dispatchedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    wo.interventionPhase = '10%';

    await wo.save();
    res.json({ success: true, data: wo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve and close work order (and resolve linked grievances)
// @route   PATCH /api/work-orders/:id/approve-close
exports.approveAndCloseWorkOrder = async (req, res) => {
  try {
    const wo = await WorkOrder.findOne({ id: req.params.id });
    if (!wo) {
      return res.status(404).json({ success: false, message: `Work Order ${req.params.id} not found` });
    }

    wo.column = 'CLOSED';
    wo.statusBadge = 'Verified & Closed';
    wo.closedAt = new Date().toLocaleTimeString();
    await wo.save();

    // Resolve associated grievances
    await Grievance.updateMany(
      { workOrderId: req.params.id },
      {
        $set: {
          status: 'RESOLVED',
          statusLabel: 'RESOLVED',
          resolutionNotes: 'Photocell alignment and electrical Megger audit verified compliant.'
        }
      }
    );

    res.json({ success: true, data: wo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject audit and return work order to field crew
// @route   PATCH /api/work-orders/:id/reject
exports.rejectWorkOrder = async (req, res) => {
  try {
    const { redoReason = 'Photocell alignment failed lux threshold test.' } = req.body;
    const wo = await WorkOrder.findOne({ id: req.params.id });
    if (!wo) {
      return res.status(404).json({ success: false, message: `Work Order ${req.params.id} not found` });
    }

    wo.column = 'IN_PROGRESS';
    wo.statusBadge = 'Redo Required';
    wo.redoReason = redoReason;
    await wo.save();

    res.json({ success: true, data: wo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete (cancel) work order
// @route   DELETE /api/work-orders/:id
exports.deleteWorkOrder = async (req, res) => {
  try {
    const wo = await WorkOrder.findOneAndDelete({ id: req.params.id });
    if (!wo) {
      return res.status(404).json({ success: false, message: `Work Order ${req.params.id} not found` });
    }
    res.json({ success: true, message: `Work Order #${req.params.id} cancelled successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

