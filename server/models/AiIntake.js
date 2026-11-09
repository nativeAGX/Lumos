const mongoose = require('mongoose');

const aiIntakeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    poleId: { type: String, required: true, index: true },
    poleTag: { type: String, required: true },
    tagType: { type: String, default: 'CIRCUIT FAULT' },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    timeAgo: { type: String, default: 'Just now' },
    title: { type: String, required: true },
    snippet: { type: String, default: '' },
    fullDescription: { type: String, default: '' },
    defectBadge: { type: String, default: 'Verified' },
    sourceApp: { type: String, default: 'Somaiya Citizen App (v4.1.2)' },
    ingestGateway: { type: String, default: 'Node Gateway 12-B' },
    residentId: { type: String, default: '#SOM-RES-8820' },
    verifiedResident: { type: Boolean, default: true },
    attachmentCount: { type: String, default: '1/1 Ingested Attachment' },
    gps: { type: String, default: '19.0728° N, 72.8998° E' },
    gpsOffset: { type: String, default: '2.1m offset from pole node' },
    shaVerified: { type: Boolean, default: true },
    sensorSpec: { type: String, default: 'Exmor CMOS • 12MP Ingest' },
    exifData: { type: String, default: 'ISO 320 • f/1.8 • 1/120s • Valid Signature' },
    photoAttachmentId: { type: String, default: 'TID: 9041-IMG-01' },
    photoEvidenceUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80'
    },
    opticalCaptureNote: { type: String, default: 'Citizen optical capture verified.' },
    neuralInference: {
      model: { type: String, default: 'Lumos-Vision-v4.1' },
      confidenceScore: { type: String, default: '95.6%' },
      detectedDefect: { type: String, default: 'General Circuit Fault' },
      thermalAnomaly: { type: Boolean, default: false },
      suggestedPriority: { type: String, default: 'High (6h SLA)' },
      protocol: { type: String, default: 'Standard Civic Redressal Protocol' },
      targetAsset: { type: String, default: '#LUM-W12-1049' },
      targetSub: { type: String, default: 'Municipal Grid Telemetry Active' },
      circuitDrop: { type: String, default: 'Circuit telemetry correlated' },
      autoIsolationRelay: { type: String, default: 'Armed' }
    },
    dedup: {
      active: { type: Boolean, default: false },
      count: { type: Number, default: 1 },
      radius: { type: String, default: 'Zero duplicates' },
      text: { type: String, default: 'Clean isolated civic report.' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiIntake', aiIntakeSchema);

