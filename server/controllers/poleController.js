const Pole = require('../models/Pole');

// @desc    Get all street poles with optional filtering
// @route   GET /api/poles
exports.getPoles = async (req, res) => {
  try {
    const { status, ward, search } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      if (status === 'FAULTS' || status === 'CRITICAL') {
        query.status = 'CRITICAL';
      } else if (status === 'ACTIVE' || status === 'HEALTHY') {
        query.status = 'HEALTHY';
      } else if (status === 'DIMMED') {
        query.status = 'DIMMED';
      }
    }

    if (ward) {
      query.ward = new RegExp(ward, 'i');
    }

    if (search) {
      query.$or = [
        { id: new RegExp(search, 'i') },
        { tag: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
        { locationName: new RegExp(search, 'i') },
        { feederPillar: new RegExp(search, 'i') }
      ];
    }

    const poles = await Pole.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: poles.length, data: poles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single pole by ID
// @route   GET /api/poles/:id
exports.getPoleById = async (req, res) => {
  try {
    const pole = await Pole.findOne({ id: req.params.id });
    if (!pole) {
      return res.status(404).json({ success: false, message: `Pole ${req.params.id} not found` });
    }
    res.json({ success: true, data: pole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new pole asset
// @route   POST /api/poles
exports.createPole = async (req, res) => {
  try {
    const body = req.body;
    const cleanId = (body.id || `LUM-W12-${Math.floor(1000 + Math.random() * 9000)}`).replace('#', '').trim();

    const existing = await Pole.findOne({ id: cleanId });
    if (existing) {
      return res.status(400).json({ success: false, message: `Pole ID ${cleanId} already exists` });
    }

    const newPole = await Pole.create({
      id: cleanId,
      tag: `#${cleanId}`,
      name: body.name || `Somaiya Pole ${cleanId.split('-').pop()}`,
      locationName: body.locationName || `${body.ward || 'Ward 12 — Somaiya Vidyavihar'}, Sector ${Math.floor(Math.random() * 8) + 1}`,
      ward: body.ward || 'Ward 12 — Somaiya Vidyavihar',
      feederPillar: body.feederPillar || 'FP-12-NORTH-C',
      circuit: body.circuit || 'Branch Circuit 12-N4',
      fixtureType: body.fixtureType || '90W Smart-Dim LED',
      coordinates: {
        lat: parseFloat(body.lat || body.coordinates?.lat) || 19.0728 + (Math.random() - 0.5) * 0.005,
        lng: parseFloat(body.lng || body.coordinates?.lng) || 72.8998 + (Math.random() - 0.5) * 0.005
      },
      mapX: body.mapX || Math.floor(150 + Math.random() * 400),
      mapY: body.mapY || Math.floor(150 + Math.random() * 250),
      status: body.status || 'HEALTHY',
      voltage: parseInt(body.voltage || 230, 10),
      voltageDropPct: 0,
      nominalVoltage: 230,
      currentDraw: 0.72,
      normalCurrent: 0.72,
      dimOutput: 100,
      luxReading: 50,
      failureRiskPct: 8,
      failureRiskText: 'Pole commissioned and telemetry synchronized to SCADA Gateway.',
      macAddress: `7A:41:09:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      firmware: 'v2.4.1',
      meshNode: 'GW-SOMAIYA-EAST-04',
      connectedPolesCount: 32,
      lastSampled: new Date().toLocaleTimeString(),
      activeFaultsCount: 0,
      cadOverlayAvailable: true
    });

    res.status(201).json({ success: true, data: newPole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pole parameters
// @route   PUT /api/poles/:id
exports.updatePole = async (req, res) => {
  try {
    const pole = await Pole.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!pole) {
      return res.status(404).json({ success: false, message: `Pole ${req.params.id} not found` });
    }

    res.json({ success: true, data: pole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete (decommission) pole
// @route   DELETE /api/poles/:id
exports.deletePole = async (req, res) => {
  try {
    const pole = await Pole.findOneAndDelete({ id: req.params.id });
    if (!pole) {
      return res.status(404).json({ success: false, message: `Pole ${req.params.id} not found` });
    }
    res.json({ success: true, message: `Pole #${req.params.id} decommissioned successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate real-time SCADA telemetry ping
// @route   POST /api/poles/:id/ping
exports.pingPoleTelemetry = async (req, res) => {
  try {
    const pole = await Pole.findOne({ id: req.params.id });
    if (!pole) {
      return res.status(404).json({ success: false, message: `Pole ${req.params.id} not found` });
    }

    const newVoltage = pole.status === 'CRITICAL' ? 142 : Math.floor(226 + Math.random() * 6);
    const newDraw = pole.status === 'CRITICAL' ? 0.65 : parseFloat((0.71 + Math.random() * 0.03).toFixed(2));
    const nowTime = new Date().toLocaleTimeString();

    pole.voltage = newVoltage;
    pole.currentDraw = newDraw;
    pole.lastSampled = nowTime;
    await pole.save();

    res.json({
      success: true,
      data: pole,
      telemetry: {
        latencyMs: 22,
        signalDbm: -62,
        meshNode: pole.meshNode,
        sampledAt: nowTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

