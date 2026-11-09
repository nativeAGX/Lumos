const mongoose = require('mongoose');

const auditProofSchema = new mongoose.Schema({
  label: { type: String, default: 'PROOF' },
  note: { type: String, default: '' },
  exif: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
});

const workOrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    poleId: { type: String, required: true, index: true },
    poleTag: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, default: 'MEDIUM PRIORITY' },
    priorityLevel: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'AUDIT PENDING'],
      default: 'MEDIUM'
    },
    column: {
      type: String,
      enum: ['TO_DISPATCH', 'IN_PROGRESS', 'UNDER_REVIEW', 'CLOSED'],
      default: 'TO_DISPATCH',
      index: true
    },
    slaTimeLeft: { type: String, default: '12h 00m left' },
    circuitZone: { type: String, default: 'Feeder C4 • Somaiya' },
    assignedCrewId: { type: String, default: '07' },
    assignedCrewName: { type: String, default: 'Crew #07 (Available)' },
    technicianName: { type: String, default: 'Rajesh Kumar' },
    vehicleNumber: { type: String, default: 'MH-03-EB-4109' },
    voltage: { type: String, default: '230V' },
    urgent: { type: Boolean, default: false },
    tags: [{ type: String }],
    statusBadge: { type: String, default: '' },
    crewBadge: { type: String, default: '' },
    crewInitials: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    gpsEta: { type: String, default: '' },
    dispatchedTime: { type: String, default: '' },
    interventionPhase: { type: String, default: '' },
    redoReason: { type: String, default: '' },
    closedAt: { type: String, default: '' },
    evidenceReady: { type: Boolean, default: false },
    proofBefore: auditProofSchema,
    proofAfter: auditProofSchema,
    resistanceReport: { type: String, default: '' },
    inspectorBadge: { type: String, default: '' },
    geoTaggedOk: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkOrder', workOrderSchema);

