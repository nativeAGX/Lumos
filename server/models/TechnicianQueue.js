const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const vanInventoryItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'in stock' },
  alert: { type: Boolean, default: false }
});

const technicianQueueSchema = new mongoose.Schema(
  {
    vanId: { type: String, default: 'VAN-07', unique: true },
    crewName: { type: String, default: 'Crew #07 • Rajesh Kumar' },
    activeJob: {
      workOrderId: { type: String, default: 'WO-2026-881' },
      workOrderTag: { type: String, default: '#WO-2026-881' },
      poleId: { type: String, default: 'LUM-W12-1049' },
      poleTag: { type: String, default: '#LUM-W12-1049' },
      title: { type: String, default: 'Exposed Junction Box & Ballast Sparking' },
      location: { type: String, default: 'Somaiya Vidyavihar North Gate, Road 4' },
      priority: { type: String, default: 'CRITICAL PRIORITY' },
      hazardRating: { type: String, default: '230V Live Terminal. Wear Class 0 Insulated PPE.' },
      protocol: { type: String, default: 'PROTOCOL E-04' },
      distance: { type: String, default: '340m away' },
      targetPoleCoordinates: { type: String, default: '19.0728° N, 72.8998° E' },
      checklist: [checklistItemSchema],
      proofBeforeUrl: { type: String, default: '' },
      proofBeforeExif: { type: String, default: '' },
      proofAfterUrl: { type: String, default: '' },
      proofAfterExif: { type: String, default: '' },
      fieldSignerId: { type: String, default: 'TECH-RK-07' }
    },
    routeStops: [
      {
        id: Number,
        ticket: String,
        poleTag: String,
        location: String,
        badge: String,
        badgeColor: String,
        active: Boolean
      }
    ],
    routeSummary: {
      totalDistance: { type: String, default: '4.8 km' },
      estTime: { type: String, default: '1h 15m' },
      status: { type: String, default: 'OPTIMAL' }
    },
    vanInventory: [vanInventoryItemSchema],
    nextInQueue: {
      id: { type: String, default: 'WO-2026-885' },
      poleId: { type: String, default: 'LUM-W12-1082' },
      poleTag: { type: String, default: 'Pole #1082' },
      title: { type: String, default: 'Luminaire Cycling & Photo-Sensor Drift' },
      location: { type: String, default: 'Somaiya Engineering Quadrangle South, Perimeter Path' },
      transit: { type: String, default: '4 mins (1.2 km)' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TechnicianQueue', technicianQueueSchema);

