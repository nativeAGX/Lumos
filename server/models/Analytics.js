const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default_analytics', unique: true },
    kpis: {
      mttr: {
        value: { type: String, default: '3.8' },
        unit: { type: String, default: 'hours' },
        diff: { type: String, default: '-24% Optimal' },
        sub: { type: String, default: '-1.2h vs Target 5.0h max' }
      },
      slaCompliance: {
        value: { type: String, default: '97.4%' },
        total: { type: String, default: '1,216 of 1,248 resolved' },
        violations: { type: String, default: '32 Violations' },
        target: { type: String, default: 'Target >95%' }
      },
      energySavings: {
        value: { type: String, default: '418.2' },
        unit: { type: String, default: 'MWh' },
        diff: { type: String, default: '-28.4% Surplus' },
        sub: { type: String, default: 'Astro-Smart Dimming 142 tCO2e saved' }
      },
      ordersCleared: {
        value: { type: String, default: '1,248' },
        unit: { type: String, default: 'tickets' },
        period: { type: String, default: 'Oct Audit' },
        avgCost: { type: String, default: '$34.20' }
      }
    },
    mttrBySector: [
      {
        sector: String,
        mttr: Number,
        status: String,
        color: String,
        target: Number,
        penalty: String
      }
    ],
    faultCategories: [
      {
        name: String,
        count: Number,
        pct: Number,
        color: String
      }
    ],
    warrantyClaimInfo: { type: String, default: 'Warranty Claim: 31.2% OEM Reimbursement' },
    activeEscalations: [
      {
        id: String,
        ticketTag: String,
        title: String,
        location: String,
        elapsedTime: String,
        slaThreshold: String,
        elapsedPct: Number,
        statusBadge: String,
        statusColor: String,
        penaltyStage: String,
        penaltyColor: String,
        assignedUnit: String,
        unitContact: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);

