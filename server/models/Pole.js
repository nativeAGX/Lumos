const mongoose = require('mongoose');

const poleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    tag: { type: String, required: true },
    name: { type: String, required: true },
    locationName: { type: String, required: true },
    ward: { type: String, default: 'Ward 12 — Somaiya Vidyavihar' },
    feederPillar: { type: String, default: 'FP-12-NORTH-C' },
    circuit: { type: String, default: 'Branch Circuit 12-N4' },
    fixtureType: { type: String, default: '90W Smart-Dim LED' },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    mapX: { type: Number, default: 350 },
    mapY: { type: Number, default: 250 },
    status: {
      type: String,
      enum: ['HEALTHY', 'DIMMED', 'CRITICAL'],
      default: 'HEALTHY'
    },
    voltage: { type: Number, default: 230 },
    voltageDropPct: { type: Number, default: 0 },
    nominalVoltage: { type: Number, default: 230 },
    currentDraw: { type: Number, default: 0.72 },
    normalCurrent: { type: Number, default: 0.72 },
    dimOutput: { type: Number, default: 100 },
    luxReading: { type: Number, default: 50 },
    failureRiskPct: { type: Number, default: 10 },
    failureRiskText: { type: String, default: 'Telemetry synchronized.' },
    macAddress: { type: String, default: '7A:41:09:00:00:00' },
    firmware: { type: String, default: 'v2.4.1' },
    meshNode: { type: String, default: 'GW-SOMAIYA-EAST-04' },
    connectedPolesCount: { type: Number, default: 24 },
    lastSampled: { type: String, default: () => new Date().toLocaleTimeString() },
    activeFaultsCount: { type: Number, default: 0 },
    cadOverlayAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pole', poleSchema);

