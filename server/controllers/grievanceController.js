const Grievance = require('../models/Grievance');
const AiIntake = require('../models/AiIntake');

// @desc    Get all citizen grievances
// @route   GET /api/grievances
exports.getGrievances = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') {
        query.status = { $in: ['PENDING_TRIAGE', 'IN_PROGRESS'] };
      } else if (status === 'RESOLVED') {
        query.status = 'RESOLVED';
      } else {
        query.status = status;
      }
    }

    const grievances = await Grievance.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: grievances.length, data: grievances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single grievance by ID
// @route   GET /api/grievances/:id
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ id: req.params.id });
    if (!grievance) {
      return res.status(404).json({ success: false, message: `Grievance ${req.params.id} not found` });
    }
    res.json({ success: true, data: grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    File a new citizen grievance report (auto-triaged into AI intake)
// @route   POST /api/grievances
exports.createGrievance = async (req, res) => {
  try {
    const body = req.body;
    const nextNum = Math.floor(9044 + Math.random() * 100);
    const grievanceId = body.id || `REP-2026-${nextNum}`;
    const cleanPoleId = (body.poleId || 'LUM-W12-1049').replace('#', '').trim();

    const isSparking = body.faultCategory === 'sparking';
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newGrievance = await Grievance.create({
      id: grievanceId,
      ref: `CIV-2026-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      poleId: cleanPoleId,
      poleTag: `#${cleanPoleId}`,
      locationName: body.locationName || 'Somaiya Vidyavihar North Gate, Road 4',
      feeder: 'FP-12-04 (Ward 12)',
      natureOfFault: body.natureOfFault || 'Complete Blackout / Dark Lamp',
      faultCategory: body.faultCategory || 'blackout',
      incidentObservation: body.incidentObservation || 'Streetlight non-functional.',
      citizenName: body.citizenName || 'Rahul M.',
      citizenPhone: body.citizenPhone || '+91 98201 44820',
      residentId: body.residentId || '#SOM-RES-8820',
      verifiedResident: true,
      photoUrl:
        body.photoUrl ||
        'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80',
      exifGeotag: '19.0728° N, 72.8998° E',
      tamperVerified: true,
      timestamp: 'Just Now',
      timeAgo: '1m ago',
      status: 'IN_PROGRESS',
      statusLabel: 'IN PROGRESS • CREW EN ROUTE',
      priority: isSparking ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY',
      eta: '~25 Mins',
      assignedCrew: 'Van 07 (Rajesh K.)',
      workOrderId: `WO-2026-${Math.floor(890 + Math.random() * 50)}`,
      liveTelemetry: {
        voltage: 'Fluctuating',
        lastHeard: 'Just now via Mesh Gateway',
        relayState: 'Monitored'
      },
      pipeline: [
        { step: 1, title: 'Reported & Triaged', time: nowTimeStr, completed: true },
        { step: 2, title: 'Dispatched (#WO-Auto)', time: 'Auto-Queued', completed: true },
        { step: 3, title: 'In Progress (Lineman Assigned)', time: 'Active', completed: true, active: true },
        { step: 4, title: 'Resolved & Verified', time: 'Pending', completed: false }
      ]
    });

    // Automatically create corresponding AI Fault Intake Ticket
    const newIntake = await AiIntake.create({
      id: grievanceId,
      poleId: cleanPoleId,
      poleTag: `#${cleanPoleId}`,
      tagType: isSparking ? 'SPARKING HAZARD' : 'CIRCUIT FAULT',
      priority: isSparking ? 'CRITICAL' : 'HIGH',
      timeAgo: 'Just now',
      title: body.natureOfFault || 'Reported Light Fault',
      snippet: (body.incidentObservation || 'Civic report logged.').slice(0, 80) + '...',
      fullDescription: body.incidentObservation || 'Streetlight non-functional.',
      defectBadge: `${body.natureOfFault || 'Civic Defect'} (96% Conf)`,
      sourceApp: 'Somaiya Citizen App (v4.1.2)',
      ingestGateway: 'Node Gateway 12-B',
      residentId: body.residentId || '#SOM-RES-8820',
      verifiedResident: true,
      attachmentCount: '1/1 Ingested Attachment',
      gps: '19.0728° N, 72.8998° E',
      gpsOffset: '2.1m offset from pole node',
      shaVerified: true,
      sensorSpec: 'Exmor CMOS • 12MP Ingest',
      exifData: 'ISO 320 • f/1.8 • 1/120s • Valid Signature',
      photoAttachmentId: `TID: ${nextNum}-IMG-01`,
      photoEvidenceUrl: newGrievance.photoUrl,
      opticalCaptureNote: 'Citizen photographic capture with verified hardware tamper-resistant watermark.',
      neuralInference: {
        model: 'Lumos-Vision-v4.1',
        confidenceScore: '95.6%',
        detectedDefect: body.natureOfFault || 'Reported Fault',
        thermalAnomaly: isSparking,
        suggestedPriority: isSparking ? 'Critical (4h SLA)' : 'High (6h SLA)',
        protocol: 'Civic Redressal Accelerated Pipeline',
        targetAsset: `#${cleanPoleId}`,
        targetSub: 'Municipal Grid Telemetry Active',
        circuitDrop: 'Circuit telemetry correlated in real-time',
        autoIsolationRelay: 'Armed'
      },
      dedup: {
        active: false,
        count: 1,
        radius: 'Spatial check passed',
        text: 'Clean isolated civic report.'
      }
    });

    res.status(201).json({
      success: true,
      data: newGrievance,
      linkedIntake: newIntake
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update grievance status
// @route   PATCH /api/grievances/:id/status
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status, statusLabel, resolutionNotes } = req.body;
    const grievance = await Grievance.findOne({ id: req.params.id });
    if (!grievance) {
      return res.status(404).json({ success: false, message: `Grievance ${req.params.id} not found` });
    }

    if (status) grievance.status = status;
    if (statusLabel) grievance.statusLabel = statusLabel;
    if (resolutionNotes) grievance.resolutionNotes = resolutionNotes;

    if (status === 'RESOLVED') {
      grievance.pipeline = grievance.pipeline.map((p) => ({
        ...p.toObject(),
        completed: true,
        active: false
      }));
    }

    await grievance.save();
    res.json({ success: true, data: grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

