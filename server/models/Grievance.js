const mongoose = require('mongoose');

const pipelineStepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  time: { type: String, default: 'Pending' },
  completed: { type: Boolean, default: false },
  active: { type: Boolean, default: false }
});

const grievanceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    ref: { type: String, required: true },
    poleId: { type: String, required: true, index: true },
    poleTag: { type: String, required: true },
    locationName: { type: String, required: true },
    feeder: { type: String, default: 'FP-12-04 (Ward 12)' },
    natureOfFault: { type: String, required: true },
    faultCategory: {
      type: String,
      enum: ['blackout', 'flickering', 'sparking', 'collision', 'other'],
      default: 'blackout'
    },
    incidentObservation: { type: String, default: '' },
    citizenName: { type: String, default: 'Rahul M.' },
    citizenPhone: { type: String, default: '+91 98201 44820' },
    residentId: { type: String, default: '#SOM-RES-8820' },
    verifiedResident: { type: Boolean, default: true },
    photoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80'
    },
    exifGeotag: { type: String, default: '19.0728° N, 72.8998° E' },
    tamperVerified: { type: Boolean, default: true },
    timestamp: { type: String, default: 'Just Now' },
    timeAgo: { type: String, default: 'Just now' },
    status: {
      type: String,
      enum: ['PENDING_TRIAGE', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'IN_PROGRESS'
    },
    statusLabel: { type: String, default: 'IN PROGRESS • CREW EN ROUTE' },
    priority: { type: String, default: 'MEDIUM PRIORITY' },
    eta: { type: String, default: '~25 Mins' },
    assignedCrew: { type: String, default: 'Van 07 (Rajesh K.)' },
    workOrderId: { type: String, default: '' },
    liveTelemetry: {
      voltage: { type: String, default: 'Fluctuating' },
      lastHeard: { type: String, default: 'Just now via Mesh Gateway' },
      relayState: { type: String, default: 'Monitored' }
    },
    pipeline: [pipelineStepSchema],
    resolutionNotes: { type: String, default: '' },
    slaDuration: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grievance', grievanceSchema);

