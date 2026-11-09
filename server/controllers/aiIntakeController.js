const AiIntake = require('../models/AiIntake');
const WorkOrder = require('../models/WorkOrder');

// @desc    Get all AI fault triage intakes
// @route   GET /api/intakes
exports.getIntakes = async (req, res) => {
  try {
    const intakes = await AiIntake.find().sort({ createdAt: -1 });
    res.json({ success: true, count: intakes.length, data: intakes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single AI intake by ID
// @route   GET /api/intakes/:id
exports.getIntakeById = async (req, res) => {
  try {
    const intake = await AiIntake.findOne({ id: req.params.id });
    if (!intake) {
      return res.status(404).json({ success: false, message: `Intake ${req.params.id} not found` });
    }
    res.json({ success: true, data: intake });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reclassify intake defect label and priority
// @route   PATCH /api/intakes/:id/reclassify
exports.reclassifyIntake = async (req, res) => {
  try {
    const { newDefect, newPriority } = req.body;
    const intake = await AiIntake.findOne({ id: req.params.id });
    if (!intake) {
      return res.status(404).json({ success: false, message: `Intake ${req.params.id} not found` });
    }

    if (newPriority) intake.priority = newPriority;
    if (newDefect) intake.defectBadge = `${newDefect} (Verified)`;
    if (intake.neuralInference) {
      if (newDefect) intake.neuralInference.detectedDefect = newDefect;
      if (newPriority) intake.neuralInference.suggestedPriority = `${newPriority} SLA Priority`;
    }

    await intake.save();
    res.json({ success: true, data: intake });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Flag intake as duplicate and suppress redundant truck roll
// @route   PATCH /api/intakes/:id/duplicate
exports.flagDuplicate = async (req, res) => {
  try {
    const intake = await AiIntake.findOne({ id: req.params.id });
    if (!intake) {
      return res.status(404).json({ success: false, message: `Intake ${req.params.id} not found` });
    }

    intake.dedup = {
      active: true,
      count: (intake.dedup?.count || 1) + 1,
      radius: '12m spatial radius',
      text: 'Report merged into parent pole cluster. Redundant truck dispatch prevented.'
    };

    await intake.save();
    res.json({ success: true, data: intake });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark intake as false alarm / optical glare and dismiss
// @route   DELETE /api/intakes/:id/false-alarm
exports.markFalseAlarm = async (req, res) => {
  try {
    const intake = await AiIntake.findOneAndDelete({ id: req.params.id });
    if (!intake) {
      return res.status(404).json({ success: false, message: `Intake ${req.params.id} not found` });
    }
    res.json({ success: true, message: `Ticket #${req.params.id} dismissed as False Alarm / Optical Glare.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve triage intake and create maintenance Work Order
// @route   POST /api/intakes/:id/approve-work-order
exports.approveToWorkOrder = async (req, res) => {
  try {
    const intake = await AiIntake.findOne({ id: req.params.id });
    if (!intake) {
      return res.status(404).json({ success: false, message: `Intake ${req.params.id} not found` });
    }

    const woId = `WO-2026-${Math.floor(882 + Math.random() * 50)}`;

    const newWO = await WorkOrder.create({
      id: woId,
      poleId: intake.poleId,
      poleTag: intake.poleTag,
      title: intake.neuralInference?.detectedDefect || intake.title,
      description: intake.fullDescription,
      priority: `${intake.priority} HAZARD`,
      priorityLevel: intake.priority,
      column: 'TO_DISPATCH',
      slaTimeLeft: intake.priority === 'CRITICAL' ? '3h 45m left' : '12h 00m left',
      circuitZone: 'Feeder C4 • Somaiya',
      assignedCrewId: '07',
      assignedCrewName: 'Crew #07 (Available)',
      technicianName: 'Rajesh Kumar',
      vehicleNumber: 'MH-03-EB-4109',
      voltage: '230V',
      urgent: intake.priority === 'CRITICAL',
      tags: ['AI Approved', intake.priority]
    });

    // Remove from pending triage queue
    await AiIntake.findOneAndDelete({ id: req.params.id });

    res.status(201).json({
      success: true,
      message: `Ticket #${woId} scheduled for Crew #07. Dispatched to maintenance queue.`,
      workOrder: newWO
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

