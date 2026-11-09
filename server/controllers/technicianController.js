const TechnicianQueue = require('../models/TechnicianQueue');
const WorkOrder = require('../models/WorkOrder');

// @desc    Get current technician queue, route, active job and van inventory
// @route   GET /api/technician/queue
exports.getTechnicianQueue = async (req, res) => {
  try {
    let queue = await TechnicianQueue.findOne({ vanId: 'VAN-07' });
    if (!queue) {
      queue = await TechnicianQueue.findOne();
    }
    res.json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle checklist item for active job
// @route   PATCH /api/technician/checklist/:checkId
exports.toggleChecklistItem = async (req, res) => {
  try {
    const { checkId } = req.params;
    let queue = await TechnicianQueue.findOne({ vanId: 'VAN-07' });
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Technician queue not found' });
    }

    const item = queue.activeJob.checklist.find((c) => c.id === checkId);
    if (item) {
      item.checked = !item.checked;
      await queue.save();
    }

    res.json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload after-photo proof with GPS EXIF tag
// @route   PATCH /api/technician/proof-after
exports.setProofAfter = async (req, res) => {
  try {
    const { dataUrl } = req.body;
    let queue = await TechnicianQueue.findOne({ vanId: 'VAN-07' });
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Technician queue not found' });
    }

    queue.activeJob.proofAfterUrl = dataUrl;
    queue.activeJob.proofAfterExif = `EXIF: 19.0728° N, 72.8998° E • ${new Date().toLocaleTimeString()} IST • ATTESTED`;
    await queue.save();

    res.json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit proof and advance to next maintenance task
// @route   POST /api/technician/submit-job
exports.submitProofAndClose = async (req, res) => {
  try {
    let queue = await TechnicianQueue.findOne({ vanId: 'VAN-07' });
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Technician queue not found' });
    }

    const job = queue.activeJob;
    const allChecked = job.checklist.every((c) => c.checked);
    if (!allChecked) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all physical checklist items before submitting for QA.'
      });
    }

    // Move associated work order to UNDER_REVIEW
    await WorkOrder.findOneAndUpdate(
      { id: job.workOrderId },
      {
        $set: {
          column: 'UNDER_REVIEW',
          evidenceReady: true,
          proofAfter: {
            label: 'PROOF AFTER',
            note: 'Technician repair attested & verified',
            exif: job.proofAfterExif || 'EXIF: 19.0728° N, 72.8998° E',
            imageUrl:
              job.proofAfterUrl ||
              'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80'
          }
        }
      }
    );

    // Advance queue to next job
    queue.activeJob = {
      workOrderId: queue.nextInQueue.id,
      workOrderTag: `#${queue.nextInQueue.id}`,
      poleId: queue.nextInQueue.poleId,
      poleTag: queue.nextInQueue.poleTag,
      title: queue.nextInQueue.title,
      location: queue.nextInQueue.location,
      priority: 'HIGH PRIORITY',
      hazardRating: 'Check Photocell drift & Ballast voltage.',
      protocol: 'PROTOCOL E-02',
      distance: '1.2 km away',
      targetPoleCoordinates: '19.0738° N, 72.9025° E',
      checklist: [
        { id: 'sensor', label: 'Cleaned Photocell Window', checked: true },
        { id: 'calibrated', label: 'Recalibrated 35 Lux Threshold', checked: false },
        { id: 'tested', label: 'Cycling Loop Tested', checked: false }
      ],
      proofBeforeUrl:
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      proofBeforeExif: 'EXIF: 19.0738° N, 72.9025° E • 09:12:00 IST',
      proofAfterUrl: '',
      proofAfterExif: 'EXIF: PENDING ATTEST',
      fieldSignerId: 'TECH-RK-07'
    };

    queue.nextInQueue = {
      id: 'WO-2026-889',
      poleId: 'LUM-W12-0922',
      poleTag: 'Pole #0922',
      title: 'Reflector Shield Bird Fouling',
      location: 'Central Campus Lawn, Pathway 2',
      transit: '8 mins (2.4 km)'
    };

    await queue.save();

    res.json({
      success: true,
      message: 'Ticket submitted for QA sign-off. Advancing to next queue item.',
      data: queue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update van inventory stock count
// @route   PATCH /api/technician/inventory/:itemId
exports.updateInventoryStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { delta } = req.body;

    let queue = await TechnicianQueue.findOne({ vanId: 'VAN-07' });
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Technician queue not found' });
    }

    const item = queue.vanInventory.find((i) => i.id === itemId);
    if (item) {
      item.stock = Math.max(0, item.stock + (Number(delta) || 0));
      item.alert = item.stock <= 1;
      await queue.save();
    }

    res.json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

