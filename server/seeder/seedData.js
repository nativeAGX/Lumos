const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Pole = require('../models/Pole');
const Grievance = require('../models/Grievance');
const AiIntake = require('../models/AiIntake');
const WorkOrder = require('../models/WorkOrder');
const TechnicianQueue = require('../models/TechnicianQueue');
const Analytics = require('../models/Analytics');
const User = require('../models/User');

const POLES_DATA = [
  {
    id: "LUM-W12-1049",
    tag: "#LUM-W12-1049",
    name: "Somaiya North Gate Pole 4",
    locationName: "Somaiya Vidyavihar North Gate, Road 4",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-NORTH-C",
    circuit: "Branch Circuit 12-N4",
    fixtureType: "90W Smart-Dim LED",
    coordinates: { lat: 19.0728, lng: 72.8998 },
    mapX: 480,
    mapY: 260,
    status: "CRITICAL",
    voltage: 142,
    voltageDropPct: -38,
    nominalVoltage: 230,
    currentDraw: 0.65,
    normalCurrent: 0.72,
    dimOutput: 100,
    luxReading: 12,
    failureRiskPct: 88,
    failureRiskText: "Imminent circuit tripping detected. High impedance surge on Phase B branch. Immediate field intervention required.",
    macAddress: "7A:41:09:BE:14:02",
    firmware: "v2.4.1",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 31,
    lastSampled: "21:04:12",
    activeFaultsCount: 1,
    cadOverlayAvailable: true
  },
  {
    id: "LUM-W12-0891",
    tag: "#LUM-W12-0891",
    name: "Vidyavihar Link Road East",
    locationName: "Vidyavihar Link Road East, Median Post 14",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-NORTH-C",
    circuit: "Branch Circuit 12-N2",
    fixtureType: "120W High-Mast LED",
    coordinates: { lat: 19.0734, lng: 72.9012 },
    mapX: 380,
    mapY: 190,
    status: "CRITICAL",
    voltage: 110,
    voltageDropPct: -52,
    nominalVoltage: 230,
    currentDraw: 0.12,
    normalCurrent: 0.95,
    dimOutput: 0,
    luxReading: 4,
    failureRiskPct: 92,
    failureRiskText: "Driver ballast open-circuit cutoff. Luminaire completely dark.",
    macAddress: "7A:41:09:BE:18:99",
    firmware: "v2.4.1",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 28,
    lastSampled: "21:02:45",
    activeFaultsCount: 1,
    cadOverlayAvailable: true
  },
  {
    id: "LUM-W12-0882",
    tag: "#LUM-W12-0882",
    name: "Library Annex Pathway",
    locationName: "Somaiya Central Library Annex West",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-WEST-A",
    circuit: "Branch Circuit 12-W1",
    fixtureType: "70W Warm-Pedestrian LED",
    coordinates: { lat: 19.0719, lng: 72.8985 },
    mapX: 520,
    mapY: 340,
    status: "DIMMED",
    voltage: 218,
    voltageDropPct: -5,
    nominalVoltage: 230,
    currentDraw: 0.54,
    normalCurrent: 0.58,
    dimOutput: 40,
    luxReading: 42,
    failureRiskPct: 64,
    failureRiskText: "Rapid high-frequency pulse strobe detected. Ballast capacitor degradation.",
    macAddress: "7A:41:09:AC:33:10",
    firmware: "v2.3.9",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 22,
    lastSampled: "20:58:10",
    activeFaultsCount: 0,
    cadOverlayAvailable: true
  },
  {
    id: "LUM-W12-0741",
    tag: "#LUM-W12-0741",
    name: "Engineering Complex Gate 2",
    locationName: "Engineering Complex West, Service Access Lane",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-NORTH-C",
    circuit: "Branch Circuit 12-N4",
    fixtureType: "90W Smart-Dim LED",
    coordinates: { lat: 19.0745, lng: 72.8972 },
    mapX: 330,
    mapY: 195,
    status: "HEALTHY",
    voltage: 229,
    voltageDropPct: 0,
    nominalVoltage: 230,
    currentDraw: 0.71,
    normalCurrent: 0.72,
    dimOutput: 100,
    luxReading: 68,
    failureRiskPct: 35,
    failureRiskText: "Enclosure tamper latch unhooked. Base hatch ajar, electrical components exposed.",
    macAddress: "7A:41:09:DD:02:88",
    firmware: "v2.4.1",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 31,
    lastSampled: "21:05:01",
    activeFaultsCount: 0,
    cadOverlayAvailable: true
  },
  {
    id: "LUM-W12-0199",
    tag: "#LUM-W12-0199",
    name: "Junction 4 Crossway",
    locationName: "Campus Central Blvd & Crossway 4",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-SOUTH-B",
    circuit: "Branch Circuit 12-S3",
    fixtureType: "100W Smart-Dim LED",
    coordinates: { lat: 19.0712, lng: 72.8965 },
    mapX: 230,
    mapY: 260,
    status: "DIMMED",
    voltage: 222,
    voltageDropPct: -3,
    nominalVoltage: 230,
    currentDraw: 0.60,
    normalCurrent: 0.75,
    dimOutput: 40,
    luxReading: 36,
    failureRiskPct: 45,
    failureRiskText: "Underground conduit water ingress. Cable seal rig active.",
    macAddress: "7A:41:09:BB:51:74",
    firmware: "v2.4.1",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 19,
    lastSampled: "21:01:14",
    activeFaultsCount: 0,
    cadOverlayAvailable: true
  },
  {
    id: "LUM-W12-0544",
    tag: "#LUM-W12-0544",
    name: "Athletics Arena Sector B",
    locationName: "Somaiya Sports Complex, Ring Perimeter",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-SOUTH-B",
    circuit: "Branch Circuit 12-S1",
    fixtureType: "150W Flood Photocell LED",
    coordinates: { lat: 19.0705, lng: 72.8950 },
    mapX: 180,
    mapY: 330,
    status: "HEALTHY",
    voltage: 231,
    voltageDropPct: 0,
    nominalVoltage: 230,
    currentDraw: 1.15,
    normalCurrent: 1.15,
    dimOutput: 100,
    luxReading: 85,
    failureRiskPct: 5,
    failureRiskText: "All telemetry nominal. Sensor replaced & sealed.",
    macAddress: "7A:41:09:EE:12:44",
    firmware: "v2.4.1",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 24,
    lastSampled: "21:03:50",
    activeFaultsCount: 0,
    cadOverlayAvailable: true
  },
  {
    id: "LUM-W12-1082",
    tag: "#LUM-W12-1082",
    name: "Engineering Quadrangle South",
    locationName: "Engineering Quadrangle South, Perimeter Path",
    ward: "Ward 12 — Somaiya Vidyavihar",
    feederPillar: "FP-12-NORTH-C",
    circuit: "Branch Circuit 12-N4",
    fixtureType: "90W Smart-Dim LED",
    coordinates: { lat: 19.0738, lng: 72.9025 },
    mapX: 520,
    mapY: 280,
    status: "DIMMED",
    voltage: 224,
    voltageDropPct: -2,
    nominalVoltage: 230,
    currentDraw: 0.68,
    normalCurrent: 0.72,
    dimOutput: 40,
    luxReading: 22,
    failureRiskPct: 28,
    failureRiskText: "Luminaire cycling & photo-sensor drift noted.",
    macAddress: "7A:41:09:AF:88:21",
    firmware: "v2.4.1",
    meshNode: "GW-SOMAIYA-EAST-04",
    connectedPolesCount: 31,
    lastSampled: "21:06:12",
    activeFaultsCount: 0,
    cadOverlayAvailable: true
  }
];

const GRIEVANCES_DATA = [
  {
    id: "REP-2026-9041",
    ref: "CIV-2026-F",
    poleId: "LUM-W12-1049",
    poleTag: "#LUM-W12-1049",
    locationName: "Somaiya North Gate, Road 4",
    feeder: "FP-12-04 (Ward 12)",
    natureOfFault: "Exposed Wires / Sparking",
    faultCategory: "sparking",
    incidentObservation: "Streetlight pole outside Vidyavihar North Gate is blacked out since rain. Base junction hatch slightly opened. Pedestrians facing difficulty.",
    citizenName: "Rahul M.",
    citizenPhone: "+91 98201 44820",
    residentId: "#SOM-RES-8820",
    verifiedResident: true,
    photoUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
    exifGeotag: "19.0728° N, 72.8998° E",
    tamperVerified: true,
    timestamp: "Today, 18:45",
    timeAgo: "24m ago",
    status: "IN_PROGRESS",
    statusLabel: "IN PROGRESS • CREW EN ROUTE",
    priority: "HIGH PRIORITY",
    eta: "~15 Mins",
    assignedCrew: "Van 07 (Rajesh K.)",
    workOrderId: "WO-2026-881",
    liveTelemetry: {
      voltage: "142 VAC (Critical Drop)",
      lastHeard: "18s ago via Mesh Gateway",
      relayState: "Primed for Auto-Cutoff"
    },
    pipeline: [
      { step: 1, title: "Reported & Triaged", time: "18:47", completed: true },
      { step: 2, title: "Dispatched (#WO-881)", time: "18:52", completed: true },
      { step: 3, title: "In Progress (Van 07 en route)", time: "19:05", completed: true, active: true },
      { step: 4, title: "Resolved & Verified", time: "Pending", completed: false }
    ]
  },
  {
    id: "REP-2026-8834",
    ref: "CIV-2025-A",
    poleId: "LUM-W12-0311",
    poleTag: "#LUM-W12-0311",
    locationName: "Campus Gate 03, Somaiya",
    feeder: "FP-12-02 (Ward 12)",
    natureOfFault: "Flickering / Strobe",
    faultCategory: "flickering",
    incidentObservation: "Light kept cycling on and off every 30 seconds after dusk.",
    citizenName: "Rahul M.",
    citizenPhone: "+91 98201 44820",
    residentId: "#SOM-RES-8820",
    verifiedResident: true,
    photoUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    exifGeotag: "19.0710° N, 72.8960° E",
    tamperVerified: true,
    timestamp: "14 Oct 2025",
    timeAgo: "Resolved",
    status: "RESOLVED",
    statusLabel: "RESOLVED",
    priority: "MEDIUM",
    slaDuration: "3.4h SLA",
    resolutionNotes: "Photocell receptacle replaced and calibrated to 35 lux trigger point.",
    assignedCrew: "Crew #11 (S. Kulkarni)",
    workOrderId: "WO-2026-872"
  },
  {
    id: "REP-2026-8512",
    ref: "CIV-2025-B",
    poleId: "LUM-W12-0742",
    poleTag: "#LUM-W12-0742",
    locationName: "Library Avenue, Somaiya",
    feeder: "FP-12-01 (Ward 12)",
    natureOfFault: "Complete Blackout / Dark Lamp",
    faultCategory: "blackout",
    incidentObservation: "Dark pedestrian pathway corridor behind science block.",
    citizenName: "Rahul M.",
    citizenPhone: "+91 98201 44820",
    residentId: "#SOM-RES-8820",
    verifiedResident: true,
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=600&q=80",
    exifGeotag: "19.0722° N, 72.8979° E",
    tamperVerified: true,
    timestamp: "28 Sep 2025",
    timeAgo: "Resolved",
    status: "RESOLVED",
    statusLabel: "RESOLVED",
    priority: "HIGH",
    slaDuration: "5.1h SLA",
    resolutionNotes: "Underground cable splice resealed with heat-shrink resin sleeve.",
    assignedCrew: "Crew #02 (Anita V.)",
    workOrderId: "WO-2026-840"
  }
];

const AI_INTAKES_DATA = [
  {
    id: "REP-2026-9041",
    poleId: "LUM-W12-1049",
    poleTag: "#LUM-W12-1049",
    tagType: "SPARKING HAZARD",
    priority: "CRITICAL",
    timeAgo: "24m ago",
    title: "Streetlight sparking & completely dark",
    snippet: "Bright orange flash witnessed while walking past the laboratory building. Continuous electric smell...",
    fullDescription: "Bright orange flash witnessed while walking past the laboratory building. Continuous electric smell and crackling sounds coming from junction box.",
    defectBadge: "Exposed Wiring (94% Conf)",
    sourceApp: "Somaiya Citizen App (v4.1.2)",
    ingestGateway: "Node Gateway 12-B",
    residentId: "#SOM-RES-8820",
    verifiedResident: true,
    attachmentCount: "1/1 Ingested Attachment",
    gps: "19.0728° N, 72.8998° E",
    gpsOffset: "3.2m offset from pole node",
    shaVerified: true,
    sensorSpec: "Exmor CMOS • 12MP Ingest",
    exifData: "ISO 400 • f/1.8 • 1/120s • Valid Signature",
    photoAttachmentId: "TID: 9041-IMG-01",
    photoEvidenceUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80",
    opticalCaptureNote: "Optical capture of base enclosure showing thermal discoloration and detached cable insulation.",
    neuralInference: {
      model: "Lumos-Vision-v4.1",
      confidenceScore: "94.2%",
      detectedDefect: "Live Wiring & Ballast Burnout",
      thermalAnomaly: true,
      suggestedPriority: "Critical (4h SLA)",
      protocol: "Public Safety Protocol",
      targetAsset: "#LUM-W12-1049",
      targetSub: "70W LED Mast / Ckt 04",
      circuitDrop: "Circuit 04 Load Drop: -840W at 20:41 UTC",
      autoIsolationRelay: "Primed"
    },
    dedup: {
      active: true,
      count: 3,
      radius: "12m spatial radius",
      text: "3 duplicate citizen reports consolidated for Pole #LUM-W12-1049 within a 12m spatial radius. Incident timeline synchronized."
    }
  },
  {
    id: "REP-2026-9042",
    poleId: "LUM-W12-0882",
    poleTag: "#LUM-W12-0882",
    tagType: "STROBE FAULT",
    priority: "MEDIUM",
    timeAgo: "45m ago",
    title: "Flickering luminaire near library annex",
    snippet: "Rapid high-frequency pulse causing low visibility on pedestrian pathway.",
    fullDescription: "Rapid high-frequency pulse causing low visibility on pedestrian pathway. Frequent rhythmic clicks heard from photocell top cap.",
    defectBadge: "Ballast Degradation (88%)",
    sourceApp: "Somaiya Citizen App (v4.1.2)",
    ingestGateway: "Node Gateway 12-A",
    residentId: "#SOM-RES-7104",
    verifiedResident: true,
    attachmentCount: "1/1 Ingested Attachment",
    gps: "19.0719° N, 72.8985° E",
    gpsOffset: "1.8m offset from pole node",
    shaVerified: true,
    sensorSpec: "ISOCELL 48MP Ingest",
    exifData: "ISO 200 • f/2.0 • 1/250s • Valid Signature",
    photoAttachmentId: "TID: 9042-IMG-02",
    photoEvidenceUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    opticalCaptureNote: "Optical capture showing high luminaire driver pulse flicker during dusk activation cycle.",
    neuralInference: {
      model: "Lumos-Vision-v4.1",
      confidenceScore: "88.4%",
      detectedDefect: "Ballast Driver Degradation",
      thermalAnomaly: false,
      suggestedPriority: "Medium (12h SLA)",
      protocol: "Standard Maintenance Protocol",
      targetAsset: "#LUM-W12-0882",
      targetSub: "70W Warm-Pedestrian LED / Ckt 12-W1",
      circuitDrop: "Circuit 12-W1 Load Flutter: ±45W variance",
      autoIsolationRelay: "Normal"
    },
    dedup: {
      active: false,
      count: 1,
      radius: "Zero duplicates",
      text: "Single isolated complaint registered."
    }
  },
  {
    id: "REP-2026-9043",
    poleId: "LUM-W12-0741",
    poleTag: "#LUM-W12-0741",
    tagType: "PHYSICAL DAMAGE",
    priority: "HIGH",
    timeAgo: "1h 12m ago",
    title: "Service door unlatched at pole base",
    snippet: "Inspection hatch dangling open facing road edge. Internal junction block visible.",
    fullDescription: "Service door unlatched at pole base. Inspection hatch dangling open facing road edge. Internal junction block visible to passing pedestrians and rainwater.",
    defectBadge: "Enclosure Tamper (91%)",
    sourceApp: "Somaiya Citizen App (v4.1.2)",
    ingestGateway: "Node Gateway 12-B",
    residentId: "#SOM-RES-4591",
    verifiedResident: true,
    attachmentCount: "1/1 Ingested Attachment",
    gps: "19.0745° N, 72.8972° E",
    gpsOffset: "0.9m offset from pole node",
    shaVerified: true,
    sensorSpec: "Sony IMX 16MP Ingest",
    exifData: "ISO 320 • f/1.9 • 1/60s • Valid Signature",
    photoAttachmentId: "TID: 9043-IMG-03",
    photoEvidenceUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80",
    opticalCaptureNote: "Optical capture showing hinged latch mechanism dislodged. Wiring bundle accessible.",
    neuralInference: {
      model: "Lumos-Vision-v4.1",
      confidenceScore: "91.1%",
      detectedDefect: "Enclosure Tamper & Gasket Compromise",
      thermalAnomaly: false,
      suggestedPriority: "High (6h SLA)",
      protocol: "Physical Hazard & Tamper Protocol",
      targetAsset: "#LUM-W12-0741",
      targetSub: "90W Smart-Dim LED / Ckt 12-N4",
      circuitDrop: "Telemetry Normal / Tamper Switch Activated",
      autoIsolationRelay: "Armed"
    },
    dedup: {
      active: false,
      count: 1,
      radius: "Zero duplicates",
      text: "Single isolated complaint registered."
    }
  }
];

const WORK_ORDERS_DATA = [
  {
    id: "WO-2026-881",
    poleId: "LUM-W12-1049",
    poleTag: "#LUM-W12-1049",
    title: "Exposed Low-Voltage Junction",
    description: "Pedestrian pathway junction box door sheared open during storm. Active wire tension exposed at 48V rail.",
    priority: "CRITICAL HAZARD",
    priorityLevel: "CRITICAL",
    column: "TO_DISPATCH",
    slaTimeLeft: "2h 14m left",
    circuitZone: "Feeder C4 • Somaiya",
    assignedCrewId: "07",
    assignedCrewName: "Crew #07 (Available)",
    technicianName: "Rajesh Kumar",
    vehicleNumber: "MH-03-EB-4109",
    voltage: "230V",
    urgent: true,
    tags: ["Live Wire", "48V Rail", "Enclosure Door"]
  },
  {
    id: "WO-2026-884",
    poleId: "LUM-W12-0412",
    poleTag: "#LUM-W12-0412",
    title: "DALI Driver Sensor Failure",
    description: "Photocell lux readings frozen at 220 lux since dawn cycle. Fallback default schedule triggered.",
    priority: "MEDIUM PRIORITY",
    priorityLevel: "MEDIUM",
    column: "TO_DISPATCH",
    slaTimeLeft: "14h 30m left",
    circuitZone: "Feeder B2 • Somaiya",
    assignedCrewId: "03",
    assignedCrewName: "Crew #03 (Queue A)",
    technicianName: "Vikram Shenoy",
    vehicleNumber: "MH-03-DF-2190",
    voltage: "230V",
    urgent: false,
    tags: ["Photocell", "DALI", "OptoSense"]
  },
  {
    id: "WO-2026-889",
    poleId: "LUM-W12-0922",
    poleTag: "#LUM-W12-0922",
    title: "Reflector Shield Bird Fouling",
    description: "Optical efficiency degraded by 18% as measured by downward lumen metric sensor.",
    priority: "LOW PRIORITY",
    priorityLevel: "LOW",
    column: "TO_DISPATCH",
    slaTimeLeft: "28h left",
    circuitZone: "Feeder A1 • Central Lawn",
    assignedCrewId: "08",
    assignedCrewName: "Crew #08 (Routine Maintenance)",
    technicianName: "Manoj Rathod",
    vehicleNumber: "MH-03-AA-9981",
    voltage: "230V",
    urgent: false,
    tags: ["Reflector", "Optical", "Cleaning"]
  },
  {
    id: "WO-2026-879",
    poleId: "LUM-W12-0891",
    poleTag: "#LUM-W12-0891",
    title: "LED Luminaire Blackout",
    description: "Driver ballast burnout caused complete blackout across median sector 14.",
    priority: "HIGH PRIORITY",
    priorityLevel: "HIGH",
    column: "IN_PROGRESS",
    statusBadge: "En Route",
    crewBadge: "Crew #04 • Rajesh K.",
    crewInitials: "RK",
    vehicle: "MH-03-EB-4109",
    gpsEta: "8 mins",
    dispatchedTime: "14:10",
    interventionPhase: "65%",
    circuitZone: "Feeder FL-09 • Vidyanagar Arterial",
    urgent: false,
    tags: ["Ballast", "High Mast", "En Route"]
  },
  {
    id: "WO-2026-877",
    poleId: "LUM-W12-0199",
    poleTag: "#LUM-W12-0199",
    title: "Underground Conduit Water Ingress",
    description: "Water seepage into secondary duct sleeve during heavy rainfall.",
    priority: "MEDIUM",
    priorityLevel: "MEDIUM",
    column: "IN_PROGRESS",
    statusBadge: "On Site",
    crewBadge: "Crew #02 • Anita V.",
    crewInitials: "AV",
    vehicle: "MH-03-CC-1022",
    dispatchedTime: "13:30",
    interventionPhase: "40%",
    circuitZone: "Feeder JP-12-04 • Somaiya Quad",
    urgent: false,
    tags: ["Conduit", "Water Ingress", "On Site"]
  },
  {
    id: "WO-2026-872",
    poleId: "LUM-W12-0544",
    poleTag: "#LUM-W12-0544",
    title: "Photocell Replacement Completed",
    description: "Replaced degraded photocell receiver with new ANSI C136.41 7-pin socket.",
    priority: "AUDIT PENDING",
    priorityLevel: "HIGH",
    column: "UNDER_REVIEW",
    evidenceReady: true,
    crewBadge: "Tech: S. Kulkarni (Crew #11)",
    geoTaggedOk: true,
    proofBefore: {
      label: "PROOF BEFORE",
      note: "Burnt sensor pin #3 (NEMA)",
      exif: "EXIF: 13:42:09 IST",
      imageUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80"
    },
    proofAfter: {
      label: "PROOF AFTER",
      note: "New 7-pin ANSI sealed",
      exif: "EXIF: 14:28:44 IST",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80"
    },
    urgent: false,
    tags: ["ANSI 7-Pin", "Photocell", "QA Audit"]
  },
  {
    id: "WO-2026-869",
    poleId: "LUM-W12-0312",
    poleTag: "#LUM-W12-0312",
    title: "Armature Grounding Wire Rewiring",
    description: "Replaced sheared ground cable and installed copper earth rod.",
    priority: "AUDIT PENDING",
    priorityLevel: "MEDIUM",
    column: "UNDER_REVIEW",
    crewBadge: "Crew #04 (Ground loop resistance: 2.1Ω passed)",
    resistanceReport: "Resistance Megger Report: Verified 100% compliant",
    inspectorBadge: "Inspector: Auto-AI Passed",
    geoTaggedOk: true,
    proofBefore: {
      label: "EARTH LUG BEFORE",
      note: "Corroded ground lug (>25Ω)",
      exif: "EXIF: 11:15:30 IST",
      imageUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=400&q=80"
    },
    proofAfter: {
      label: "EARTH LUG AFTER",
      note: "New M6 Copper Lug (2.1Ω passed)",
      exif: "EXIF: 12:40:12 IST",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
    },
    urgent: false,
    tags: ["Megger Test", "Grounding", "Earthing"]
  }
];

const TECHNICIAN_QUEUE_DATA = {
  vanId: "VAN-07",
  crewName: "Crew #07 • Rajesh Kumar",
  activeJob: {
    workOrderId: "WO-2026-881",
    workOrderTag: "#WO-2026-881",
    poleId: "LUM-W12-1049",
    poleTag: "#LUM-W12-1049",
    title: "Exposed Junction Box & Ballast Sparking",
    location: "Somaiya Vidyavihar North Gate, Road 4 (Pole #LUM-W12-1049)",
    priority: "CRITICAL PRIORITY",
    hazardRating: "230V Live Terminal. Wear Class 0 Insulated PPE.",
    protocol: "PROTOCOL E-04",
    distance: "340m away",
    targetPoleCoordinates: "19.0728° N, 72.8998° E",
    checklist: [
      { id: "ballast", label: "Replaced Ballast", checked: true },
      { id: "gasket", label: "Resealed Gasket", checked: true },
      { id: "ground_lug", label: "Torqued Ground Lug", checked: false }
    ],
    proofBeforeUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
    proofBeforeExif: "EXIF: 19.0728° N, 72.8998° E • 08:24:11 IST",
    proofAfterUrl: "",
    proofAfterExif: "EXIF: 19.0728° N, 72.8998° E • PENDING ATTEST",
    fieldSignerId: "TECH-RK-07"
  },
  routeStops: [
    {
      id: 1,
      ticket: "#WO-2026-881 (Current)",
      poleTag: "Pole #LUM-W12-1049",
      location: "Somaiya North Gate",
      badge: "230V",
      badgeColor: "bg-rose-100 text-rose-700",
      active: true
    },
    {
      id: 2,
      ticket: "#WO-2026-885",
      poleTag: "Pole #LUM-W12-1082",
      location: "Quadrangle South",
      badge: "Routine",
      badgeColor: "bg-slate-100 text-slate-700",
      active: false
    },
    {
      id: 3,
      ticket: "Return Somaiya Central Depot",
      poleTag: "Central Depot Yard 4",
      location: "ETA 15:45 IST",
      badge: "Depot",
      badgeColor: "bg-amber-100 text-amber-700",
      active: false
    }
  ],
  routeSummary: {
    totalDistance: "4.8 km",
    estTime: "1h 15m",
    status: "OPTIMAL"
  },
  vanInventory: [
    { id: "inv_1", name: "150W LED Ballast Driver", stock: 4, unit: "in stock", alert: false },
    { id: "inv_2", name: "IP66 Weatherproof Gaskets", stock: 12, unit: "in stock", alert: false },
    { id: "inv_3", name: "NEMA 7-Pin Photo-Sensors", stock: 1, unit: "left", alert: true },
    { id: "inv_4", name: "M6 Copper Ground Lugs", stock: 18, unit: "in stock", alert: false }
  ],
  nextInQueue: {
    id: "WO-2026-885",
    poleId: "LUM-W12-1082",
    poleTag: "Pole #1082",
    title: "Luminaire Cycling & Photo-Sensor Drift",
    location: "Somaiya Engineering Quadrangle South, Perimeter Path",
    transit: "4 mins (1.2 km)"
  }
};

const ANALYTICS_DATA = {
  key: "default_analytics",
  kpis: {
    mttr: { value: "3.8", unit: "hours", diff: "-24% Optimal", sub: "-1.2h vs Target 5.0h max" },
    slaCompliance: { value: "97.4%", total: "1,216 of 1,248 resolved", violations: "32 Violations", target: "Target >95%" },
    energySavings: { value: "418.2", unit: "MWh", diff: "-28.4% Surplus", sub: "Astro-Smart Dimming 142 tCO2e saved" },
    ordersCleared: { value: "1,248", unit: "tickets", period: "Oct Audit", avgCost: "$34.20" }
  },
  mttrBySector: [
    { sector: "Ward 12 (Somaiya - Central Tech)", mttr: 3.8, status: "Compliant", color: "#10b981", target: 5.0 },
    { sector: "Ward 04 (Industrial Harbor)", mttr: 6.2, status: "Breached", color: "#f43f5e", target: 5.0, penalty: "$4,800 withheld due to underground splice delays." },
    { sector: "Ward 08 (Coastal Promenade)", mttr: 4.1, status: "Compliant", color: "#10b981", target: 5.0 }
  ],
  faultCategories: [
    { name: "Burnt Ballast & Driver Failures", count: 524, pct: 42, color: "#f59e0b" },
    { name: "Photocell Sensor Drift / DALI Fault", count: 300, pct: 24, color: "#0ea5e9" },
    { name: "Cable Moisture & Conduit Ingress", count: 224, pct: 18, color: "#f97316" },
    { name: "Vehicle Impact & Physical Tampering", count: 200, pct: 16, color: "#ef4444" }
  ],
  warrantyClaimInfo: "Warranty Claim: 31.2% OEM Reimbursement",
  activeEscalations: [
    {
      id: "WO-2026-881",
      ticketTag: "#WO-2026-881",
      title: "Exposed Ballast & Spark Ingress",
      location: "Junction Pillar JP-12-04 • Somaiya Quad",
      elapsedTime: "04h 12m",
      slaThreshold: "05h 00m",
      elapsedPct: 84,
      statusBadge: "Escalated to Chief Engineer",
      statusColor: "bg-rose-50 text-rose-700 border-rose-200",
      penaltyStage: "Penalty Stage 1",
      penaltyColor: "bg-rose-500 text-white",
      assignedUnit: "AlphaGrid Tech",
      unitContact: "Contractor Rep #09"
    },
    {
      id: "WO-2026-879",
      ticketTag: "#WO-2026-879",
      title: "Array Blackout (14 Luminaires)",
      location: "Feeder Line FL-09 • Vidyanagar Arterial",
      elapsedTime: "03h 45m",
      slaThreshold: "05h 00m",
      elapsedPct: 75,
      statusBadge: "Van #07 En Route (ETA 8m)",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
      penaltyStage: "Warning Threshold",
      penaltyColor: "bg-amber-500 text-white",
      assignedUnit: "Tech Lead: R. Nair",
      unitContact: "Crew #04"
    },
    {
      id: "WO-2026-872",
      ticketTag: "#WO-2026-872",
      title: "Photocell Sensor Replacement",
      location: "Smart Pole P-SOM-104 • Central Ring",
      elapsedTime: "02h 15m",
      slaThreshold: "05h 00m",
      elapsedPct: 45,
      statusBadge: "Closed in SLA",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      penaltyStage: "Zero Penalty",
      penaltyColor: "bg-emerald-600 text-white",
      assignedUnit: "SCADA Node Verified",
      unitContact: "Auto-Telemetry Validated"
    }
  ]
};

const USERS_DATA = [
  {
    id: "ward_officer",
    roleKey: "ward_officer",
    title: "Ward Officer / Municipal In-Charge",
    name: "Dr. Sandeep Deshmukh",
    email: "officer.deshmukh@somaiya.gov.in",
    password: "password123",
    ward: "Ward 12 — Somaiya Vidyavihar",
    type: "OPERATIONS",
    badge: "Tier-3 Auth",
    avatar: "SD"
  },
  {
    id: "field_tech",
    roleKey: "field_tech",
    title: "Field Lead Technician",
    name: "Rajesh Kumar",
    unit: "Somaiya Unit #07",
    email: "rajesh.k@field.lumos.gov.in",
    password: "password123",
    ward: "Ward 12 Electrical Cell",
    type: "OPERATIONS",
    badge: "Field Ops",
    avatar: "RK"
  },
  {
    id: "citizen",
    roleKey: "citizen",
    title: "Registered Resident",
    name: "Rahul M.",
    phone: "+91 98201 44820",
    email: "rahul.m@somaiya.edu",
    password: "password123",
    ward: "Ward 12 Somaiya Campus",
    type: "CITIZEN",
    badge: "Verified Resident",
    avatar: "RM"
  }
];

const seedDB = async (silent = false) => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumos_db';
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    }

    if (!silent) console.log('🔄 Cleaning old collections...');
    await Promise.all([
      Pole.deleteMany({}),
      Grievance.deleteMany({}),
      AiIntake.deleteMany({}),
      WorkOrder.deleteMany({}),
      TechnicianQueue.deleteMany({}),
      Analytics.deleteMany({}),
      User.deleteMany({})
    ]);

    if (!silent) console.log('🌱 Seeding Lumos Municipal dataset into MongoDB...');
    await Promise.all([
      Pole.insertMany(POLES_DATA),
      Grievance.insertMany(GRIEVANCES_DATA),
      AiIntake.insertMany(AI_INTAKES_DATA),
      WorkOrder.insertMany(WORK_ORDERS_DATA),
      TechnicianQueue.create(TECHNICIAN_QUEUE_DATA),
      Analytics.create(ANALYTICS_DATA),
      Promise.all(USERS_DATA.map((u) => User.create(u)))
    ]);

    if (!silent) {
      console.log('✅ Seeding complete!');
      console.log(`   - Poles: ${POLES_DATA.length}`);
      console.log(`   - Grievances: ${GRIEVANCES_DATA.length}`);
      console.log(`   - AI Intakes: ${AI_INTAKES_DATA.length}`);
      console.log(`   - Work Orders: ${WORK_ORDERS_DATA.length}`);
      console.log(`   - Technician Queue: 1 active vehicle unit`);
      console.log(`   - Analytics: KPI & Sector benchmark populated`);
      console.log(`   - Users: 3 default roles (Ward Officer, Field Tech, Citizen)`);
    }

    return true;
  } catch (error) {
    if (!silent) console.error('❌ Seeding error:', error.message);
    return false;
  }
};

// Check if database needs auto-seeding on startup
const autoSeedIfEmpty = async () => {
  try {
    const poleCount = await Pole.countDocuments();
    if (poleCount === 0) {
      console.log('📦 Database appears empty. Running initial auto-seeder...');
      await seedDB(true);
      console.log('✅ Initial Lumos database auto-seeded successfully!');
    }
  } catch (e) {
    // Silent on connection failure
  }
};

if (require.main === module) {
  seedDB().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = { seedDB, autoSeedIfEmpty };

