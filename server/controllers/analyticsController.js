const Analytics = require('../models/Analytics');
const WorkOrder = require('../models/WorkOrder');

// @desc    Get SLA Analytics, KPIs and sector metrics
// @route   GET /api/analytics
exports.getAnalytics = async (req, res) => {
  try {
    let analytics = await Analytics.findOne({ key: 'default_analytics' });
    if (!analytics) {
      analytics = await Analytics.findOne();
    }
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate CSV Municipal Audit Report
// @route   GET /api/analytics/export
exports.exportAuditReport = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().sort({ createdAt: -1 });

    const rows = [
      ['LUMOS MUNICIPAL AUDIT REPORT', new Date().toISOString(), 'Ward 12 — Somaiya Vidyavihar'],
      [],
      ['METRICS SUMMARY'],
      ['Citywide MTTR', '3.8 hours', 'Target: <5.0h', 'Status: Compliant'],
      ['SLA Compliance Rate', '97.4%', 'Violations: 32', 'Target: >95%'],
      ['Energy Conservation', '418.2 MWh', 'CO2 Saved: 142 tons', 'Surplus: -28.4%'],
      ['Work Orders Cleared', '1,248 tickets', 'Avg Unit Cost: $34.20'],
      [],
      ['SECTOR PERFORMANCE'],
      ['Sector', 'MTTR (Hours)', 'Target', 'Status', 'Notes'],
      ['Ward 12 (Somaiya - Central Tech)', '3.8', '5.0', 'Compliant', 'Nominal mesh uptime 99.8%'],
      ['Ward 04 (Industrial Harbor)', '6.2', '5.0', 'Breached', 'Penalty $4,800 withheld due to underground splice delays'],
      ['Ward 08 (Coastal Promenade)', '4.1', '5.0', 'Compliant', 'Salt spray corrosion prevention applied'],
      [],
      ['CURRENT WORK ORDERS SNAPSHOT'],
      ['WO ID', 'Pole Tag', 'Title', 'Priority', 'Status', 'Technician', 'Voltage'],
      ...workOrders.map((wo) => [
        wo.id,
        wo.poleTag,
        `"${(wo.title || '').replace(/"/g, '""')}"`,
        wo.priorityLevel,
        wo.column,
        wo.technicianName || 'Unassigned',
        wo.voltage || '230V'
      ])
    ];

    const csvContent = rows.map((e) => e.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="lumos_municipal_audit.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

