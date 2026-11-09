import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_POLES,
  INITIAL_GRIEVANCES,
  INITIAL_AI_INTAKES,
  INITIAL_WORK_ORDERS,
  INITIAL_TECHNICIAN_QUEUE,
  INITIAL_ANALYTICS
} from '../data/mockData';
import {
  showSuccessToast,
  showInfoToast,
  showWarningToast,
  downloadCSV
} from '../utils/helpers';
import * as api from '../services/api';

const LumosContext = createContext(null);

export const LumosProvider = ({ children }) => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 1. Poles & GIS State
  const [poles, setPoles] = useState(() => {
    const saved = localStorage.getItem('lumos_poles');
    return saved ? JSON.parse(saved) : INITIAL_POLES;
  });
  const [selectedPoleId, setSelectedPoleId] = useState("LUM-W12-1049");
  const [activeGisFilter, setActiveGisFilter] = useState("ALL"); // ALL, ACTIVE, DIMMED, FAULTS

  // 2. Grievances State
  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('lumos_grievances');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });
  const [grievanceTab, setGrievanceTab] = useState("ALL"); // ALL, ACTIVE, CLOSED

  // 3. AI Fault Intakes State
  const [aiIntakes, setAiIntakes] = useState(() => {
    const saved = localStorage.getItem('lumos_ai_intakes');
    return saved ? JSON.parse(saved) : INITIAL_AI_INTAKES;
  });
  const [selectedIntakeId, setSelectedIntakeId] = useState("REP-2026-9041");

  // 4. Work Orders State
  const [workOrders, setWorkOrders] = useState(() => {
    const saved = localStorage.getItem('lumos_work_orders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });
  const [workOrderFilterPriority, setWorkOrderFilterPriority] = useState("ALL");
  const [workOrderFilterCrew, setWorkOrderFilterCrew] = useState("ALL");
  const [workOrderSearch, setWorkOrderSearch] = useState("");

  // 5. Field Technician Queue
  const [technicianQueue, setTechnicianQueue] = useState(() => {
    const saved = localStorage.getItem('lumos_tech_queue');
    return saved ? JSON.parse(saved) : INITIAL_TECHNICIAN_QUEUE;
  });

  // 6. SLA Analytics
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);
  const [analyticsWindow, setAnalyticsWindow] = useState("Last 30 Days");

  // 7. General & Modal States
  const [selectedWard, setSelectedWard] = useState("Ward 12 — Somaiya Vidyavihar");
  const [isRegisterPoleOpen, setIsRegisterPoleOpen] = useState(false);
  const [isCreateWorkOrderOpen, setIsCreateWorkOrderOpen] = useState(false);
  const [inspectModalPole, setInspectModalPole] = useState(null);
  const [cadOverlayPole, setCadOverlayPole] = useState(null);

  // Initialize and synchronize with Express / MongoDB API
  useEffect(() => {
    let isMounted = true;
    const syncBackendData = async () => {
      try {
        const health = await api.checkBackendHealth();
        if (health && health.status === 'ONLINE' && isMounted) {
          setIsBackendConnected(true);
          const [polesRes, grievancesRes, intakesRes, woRes, techRes, analyticsRes] = await Promise.allSettled([
            api.fetchPoles(),
            api.fetchGrievances(),
            api.fetchAiIntakes(),
            api.fetchWorkOrders(),
            api.fetchTechnicianQueue(),
            api.fetchAnalytics()
          ]);

          if (isMounted) {
            if (polesRes.status === 'fulfilled' && polesRes.value?.length) {
              setPoles(polesRes.value);
            }
            if (grievancesRes.status === 'fulfilled' && grievancesRes.value?.length) {
              setGrievances(grievancesRes.value);
            }
            if (intakesRes.status === 'fulfilled' && intakesRes.value?.length) {
              setAiIntakes(intakesRes.value);
            }
            if (woRes.status === 'fulfilled' && woRes.value?.length) {
              setWorkOrders(woRes.value);
            }
            if (techRes.status === 'fulfilled' && techRes.value) {
              setTechnicianQueue(techRes.value);
            }
            if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
              setAnalytics(analyticsRes.value);
            }
          }
        }
      } catch (err) {
        console.info('Backend API running in local-first mode:', err.message);
      }
    };

    syncBackendData();
    return () => { isMounted = false; };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lumos_poles', JSON.stringify(poles));
  }, [poles]);

  useEffect(() => {
    localStorage.setItem('lumos_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('lumos_ai_intakes', JSON.stringify(aiIntakes));
  }, [aiIntakes]);

  useEffect(() => {
    localStorage.setItem('lumos_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('lumos_tech_queue', JSON.stringify(technicianQueue));
  }, [technicianQueue]);

  // Selected Pole Reference
  const selectedPole = poles.find((p) => p.id === selectedPoleId) || poles[0];
  const selectedIntake = aiIntakes.find((i) => i.id === selectedIntakeId) || aiIntakes[0];

  // ----------------------------------------------------
  // POLES CRUD & TELEMETRY
  // ----------------------------------------------------
  const registerPole = async (newPoleData) => {
    const cleanId = (newPoleData.id || `LUM-W12-${Math.floor(1000 + Math.random() * 9000)}`).replace('#', '');
    const created = {
      id: cleanId,
      tag: `#${cleanId}`,
      name: newPoleData.name || `Somaiya Pole ${cleanId.split('-').pop()}`,
      locationName: newPoleData.locationName || `${selectedWard}, Sector ${Math.floor(Math.random() * 8) + 1}`,
      ward: selectedWard,
      feederPillar: newPoleData.feederPillar || "FP-12-NORTH-C",
      circuit: newPoleData.circuit || "Branch Circuit 12-N4",
      fixtureType: newPoleData.fixtureType || "90W Smart-Dim LED",
      coordinates: {
        lat: parseFloat(newPoleData.lat) || 19.0728 + (Math.random() - 0.5) * 0.005,
        lng: parseFloat(newPoleData.lng) || 72.8998 + (Math.random() - 0.5) * 0.005
      },
      mapX: Math.floor(150 + Math.random() * 400),
      mapY: Math.floor(150 + Math.random() * 250),
      status: newPoleData.status || "HEALTHY",
      voltage: parseInt(newPoleData.voltage || 230, 10),
      voltageDropPct: 0,
      nominalVoltage: 230,
      currentDraw: 0.72,
      normalCurrent: 0.72,
      dimOutput: 100,
      luxReading: 50,
      failureRiskPct: 8,
      failureRiskText: "Pole commissioned and telemetry synchronized to SCADA Gateway.",
      macAddress: `7A:41:09:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      firmware: "v2.4.1",
      meshNode: "GW-SOMAIYA-EAST-04",
      connectedPolesCount: 32,
      lastSampled: new Date().toLocaleTimeString(),
      activeFaultsCount: 0,
      cadOverlayAvailable: true
    };

    setPoles((prev) => [created, ...prev]);
    setSelectedPoleId(created.id);
    showSuccessToast("Pole Asset Registered", `Pole ${created.tag} added to ${selectedWard}`);

    try {
      await api.createPoleApi(created);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
    return created;
  };

  const updatePole = async (poleId, updatedFields) => {
    setPoles((prev) =>
      prev.map((pole) => (pole.id === poleId ? { ...pole, ...updatedFields } : pole))
    );
    showSuccessToast("Asset Updated", `Pole #${poleId} telemetry parameters updated.`);

    try {
      await api.updatePoleApi(poleId, updatedFields);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const deletePole = async (poleId) => {
    setPoles((prev) => prev.filter((p) => p.id !== poleId));
    if (selectedPoleId === poleId) {
      const remaining = poles.filter((p) => p.id !== poleId);
      if (remaining.length > 0) {
        setSelectedPoleId(remaining[0].id);
      }
    }
    showWarningToast("Pole Decommissioned", `Pole #${poleId} removed from GIS mesh.`);

    try {
      await api.deletePoleApi(poleId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const pingPoleTelemetry = async (poleId) => {
    const target = poles.find((p) => p.id === poleId);
    if (!target) return;

    // Simulate fluctuation
    const newVoltage = target.status === 'CRITICAL' ? 142 : Math.floor(226 + Math.random() * 6);
    const newDraw = target.status === 'CRITICAL' ? 0.65 : parseFloat((0.71 + Math.random() * 0.03).toFixed(2));
    const nowTime = new Date().toLocaleTimeString();

    setPoles((prev) =>
      prev.map((p) =>
        p.id === poleId
          ? {
              ...p,
              voltage: newVoltage,
              currentDraw: newDraw,
              lastSampled: nowTime
            }
          : p
      )
    );

    showInfoToast(
      `Node Ping ACK: ${target.tag}`,
      `Latency: 22ms via ${target.meshNode} • Signal: -62dBm • Sampled at ${nowTime}`
    );

    try {
      const res = await api.pingPoleApi(poleId);
      if (res?.data) {
        setPoles((prev) => prev.map((p) => (p.id === poleId ? { ...p, ...res.data } : p)));
      }
    } catch (e) {
      // Local optimistic update already shown
    }
  };

  // ----------------------------------------------------
  // CITIZEN GRIEVANCE PORTAL ACTIONS
  // ----------------------------------------------------
  const fileGrievance = async (formData) => {
    const nextNum = Math.floor(9044 + Math.random() * 100);
    const grievanceId = `REP-2026-${nextNum}`;
    const cleanPoleId = (formData.poleId || "LUM-W12-1049").replace('#', '').trim();

    const newGrievance = {
      id: grievanceId,
      ref: `CIV-2026-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      poleId: cleanPoleId,
      poleTag: `#${cleanPoleId}`,
      locationName: formData.locationName || "Somaiya Vidyavihar North Gate, Road 4",
      feeder: "FP-12-04 (Ward 12)",
      natureOfFault: formData.natureOfFault || "Complete Blackout / Dark Lamp",
      faultCategory: formData.faultCategory || "blackout",
      incidentObservation: formData.incidentObservation || "Streetlight non-functional.",
      citizenName: formData.citizenName || "Rahul M.",
      citizenPhone: formData.citizenPhone || "+91 98201 44820",
      residentId: "#SOM-RES-8820",
      verifiedResident: true,
      photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
      exifGeotag: "19.0728° N, 72.8998° E",
      tamperVerified: true,
      timestamp: "Just Now",
      timeAgo: "1m ago",
      status: "IN_PROGRESS",
      statusLabel: "IN PROGRESS • CREW EN ROUTE",
      priority: formData.faultCategory === "sparking" ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
      eta: "~25 Mins",
      assignedCrew: "Van 07 (Rajesh K.)",
      workOrderId: `WO-2026-${Math.floor(890 + Math.random() * 50)}`,
      liveTelemetry: {
        voltage: "Fluctuating",
        lastHeard: "Just now via Mesh Gateway",
        relayState: "Monitored"
      },
      pipeline: [
        { step: 1, title: "Reported & Triaged", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { step: 2, title: "Dispatched (#WO-Auto)", time: "Auto-Queued", completed: true },
        { step: 3, title: "In Progress (Lineman Assigned)", time: "Active", completed: true, active: true },
        { step: 4, title: "Resolved & Verified", time: "Pending", completed: false }
      ]
    };

    setGrievances((prev) => [newGrievance, ...prev]);

    // Also inject into AI triage feed
    const newIntake = {
      id: grievanceId,
      poleId: cleanPoleId,
      poleTag: `#${cleanPoleId}`,
      tagType: formData.faultCategory === "sparking" ? "SPARKING HAZARD" : "CIRCUIT FAULT",
      priority: formData.faultCategory === "sparking" ? "CRITICAL" : "HIGH",
      timeAgo: "Just now",
      title: formData.natureOfFault,
      snippet: formData.incidentObservation.slice(0, 80) + "...",
      fullDescription: formData.incidentObservation,
      defectBadge: `${formData.natureOfFault} (96% Conf)`,
      sourceApp: "Somaiya Citizen App (v4.1.2)",
      ingestGateway: "Node Gateway 12-B",
      residentId: "#SOM-RES-8820",
      verifiedResident: true,
      attachmentCount: "1/1 Ingested Attachment",
      gps: "19.0728° N, 72.8998° E",
      gpsOffset: "2.1m offset from pole node",
      shaVerified: true,
      sensorSpec: "Exmor CMOS • 12MP Ingest",
      exifData: "ISO 320 • f/1.8 • 1/120s • Valid Signature",
      photoAttachmentId: `TID: ${nextNum}-IMG-01`,
      photoEvidenceUrl: newGrievance.photoUrl,
      opticalCaptureNote: "Citizen photographic capture with verified hardware tamper-resistant watermark.",
      neuralInference: {
        model: "Lumos-Vision-v4.1",
        confidenceScore: "95.6%",
        detectedDefect: formData.natureOfFault,
        thermalAnomaly: formData.faultCategory === "sparking",
        suggestedPriority: formData.faultCategory === "sparking" ? "Critical (4h SLA)" : "High (6h SLA)",
        protocol: "Civic Redressal Accelerated Pipeline",
        targetAsset: `#${cleanPoleId}`,
        targetSub: "Municipal Grid Telemetry Active",
        circuitDrop: "Circuit telemetry correlated in real-time",
        autoIsolationRelay: "Armed"
      },
      dedup: {
        active: false,
        count: 1,
        radius: "Spatial check passed",
        text: "Clean isolated civic report."
      }
    };

    setAiIntakes((prev) => [newIntake, ...prev]);
    setSelectedIntakeId(newIntake.id);

    showSuccessToast(
      "Grievance Lodged Successfully",
      `Ticket #${grievanceId} dispatched to Ward 12 Electrical Cell with real-time tracking.`
    );

    try {
      await api.createGrievanceApi(formData);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }

    return newGrievance;
  };

  // ----------------------------------------------------
  // AI TRIAGE ACTIONS
  // ----------------------------------------------------
  const reclassifyIntake = async (intakeId, newDefect, newPriority) => {
    setAiIntakes((prev) =>
      prev.map((item) =>
        item.id === intakeId
          ? {
              ...item,
              priority: newPriority || item.priority,
              defectBadge: `${newDefect} (Verified)`,
              neuralInference: {
                ...item.neuralInference,
                detectedDefect: newDefect,
                suggestedPriority: `${newPriority} SLA Priority`
              }
            }
          : item
      )
    );
    showSuccessToast("AI Triage Re-classified", `Ticket #${intakeId} re-assigned as ${newDefect}`);

    try {
      await api.reclassifyIntakeApi(intakeId, newDefect, newPriority);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const flagDuplicate = async (intakeId) => {
    setAiIntakes((prev) =>
      prev.map((item) =>
        item.id === intakeId
          ? {
              ...item,
              dedup: {
                active: true,
                count: (item.dedup?.count || 1) + 1,
                radius: "12m spatial radius",
                text: "Report merged into parent pole cluster. Redundant truck dispatch prevented."
              }
            }
          : item
      )
    );
    showInfoToast("Duplicate Suppressed", `Ticket #${intakeId} consolidated into spatial cluster.`);

    try {
      await api.flagDuplicateApi(intakeId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const markFalseAlarm = async (intakeId) => {
    setAiIntakes((prev) => prev.filter((item) => item.id !== intakeId));
    if (selectedIntakeId === intakeId) {
      const remaining = aiIntakes.filter((i) => i.id !== intakeId);
      if (remaining.length > 0) setSelectedIntakeId(remaining[0].id);
    }
    showWarningToast("Dismissed", `Ticket #${intakeId} marked as False Alarm / Optical Glare.`);

    try {
      await api.markFalseAlarmApi(intakeId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const approveWorkOrderFromTriage = async (intakeId) => {
    const intake = aiIntakes.find((i) => i.id === intakeId) || aiIntakes[0];
    const woId = `WO-2026-${Math.floor(882 + Math.random() * 50)}`;

    const newWO = {
      id: woId,
      poleId: intake.poleId,
      poleTag: intake.poleTag,
      title: intake.neuralInference?.detectedDefect || intake.title,
      description: intake.fullDescription,
      priority: `${intake.priority} HAZARD`,
      priorityLevel: intake.priority,
      column: "TO_DISPATCH",
      slaTimeLeft: intake.priority === "CRITICAL" ? "3h 45m left" : "12h 00m left",
      circuitZone: "Feeder C4 • Somaiya",
      assignedCrewId: "07",
      assignedCrewName: "Crew #07 (Available)",
      technicianName: "Rajesh Kumar",
      vehicleNumber: "MH-03-EB-4109",
      voltage: "230V",
      urgent: intake.priority === "CRITICAL",
      tags: ["AI Approved", intake.priority]
    };

    setWorkOrders((prev) => [newWO, ...prev]);
    // remove from pending triage queue
    setAiIntakes((prev) => prev.filter((i) => i.id !== intakeId));
    if (aiIntakes.length > 1) {
      const nextRemaining = aiIntakes.find((i) => i.id !== intakeId);
      if (nextRemaining) setSelectedIntakeId(nextRemaining.id);
    }

    showSuccessToast(
      "Work Order Created",
      `Ticket #${woId} scheduled for Crew #07. Dispatched to maintenance queue.`
    );

    try {
      await api.approveWorkOrderFromTriageApi(intakeId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  // ----------------------------------------------------
  // WORK ORDERS CRUD & ACTIONS
  // ----------------------------------------------------
  const createWorkOrder = async (woData) => {
    const woId = `WO-2026-${Math.floor(895 + Math.random() * 90)}`;
    const cleanPole = (woData.poleId || "LUM-W12-1049").replace('#', '').trim();
    const created = {
      id: woId,
      poleId: cleanPole,
      poleTag: `#${cleanPole}`,
      title: woData.title || "Luminaire Hardware Inspection",
      description: woData.description || "Routine circuit check and component overhaul.",
      priority: woData.priority || "MEDIUM PRIORITY",
      priorityLevel: woData.priorityLevel || "MEDIUM",
      column: "TO_DISPATCH",
      slaTimeLeft: woData.priorityLevel === "CRITICAL" ? "2h 30m left" : "16h 00m left",
      circuitZone: woData.circuitZone || "Feeder C4 • Somaiya",
      assignedCrewId: woData.crewId || "07",
      assignedCrewName: `Crew #${woData.crewId || "07"} (${woData.crewName || "Available"})`,
      technicianName: woData.technicianName || "Rajesh Kumar",
      vehicleNumber: "MH-03-EB-4109",
      voltage: "230V",
      urgent: woData.priorityLevel === "CRITICAL",
      tags: [woData.priorityLevel || "MEDIUM", "Manual Order"]
    };

    setWorkOrders((prev) => [created, ...prev]);
    showSuccessToast("Work Order Scheduled", `#${woId} queued in dispatch system.`);

    try {
      await api.createWorkOrderApi(woData);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }

    return created;
  };

  const dispatchWorkOrder = async (workOrderId, crewName = "Crew #07 • Rajesh K.") => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === workOrderId
          ? {
              ...wo,
              column: "IN_PROGRESS",
              statusBadge: "En Route",
              crewBadge: crewName,
              crewInitials: "RK",
              vehicle: "MH-03-EB-4109",
              gpsEta: "6 mins",
              dispatchedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              interventionPhase: "10%"
            }
          : wo
      )
    );
    showSuccessToast(
      "Crew Dispatched",
      `Work Order #${workOrderId} is now IN PROGRESS with ${crewName}.`
    );

    try {
      await api.dispatchWorkOrderApi(workOrderId, crewName);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const approveAndCloseWorkOrder = async (workOrderId) => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === workOrderId
          ? {
              ...wo,
              column: "CLOSED",
              statusBadge: "Verified & Closed",
              closedAt: new Date().toLocaleTimeString()
            }
          : wo
      )
    );
    // Also resolve related grievances
    setGrievances((prev) =>
      prev.map((g) =>
        g.workOrderId === workOrderId
          ? {
              ...g,
              status: "RESOLVED",
              statusLabel: "RESOLVED",
              pipeline: g.pipeline?.map((p) => ({ ...p, completed: true, active: false }))
            }
          : g
      )
    );
    showSuccessToast(
      "Work Order Approved & Closed",
      `Audit completed for #${workOrderId}. Megger & photographic verification compliant.`
    );

    try {
      await api.approveAndCloseWorkOrderApi(workOrderId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const rejectWorkOrder = async (workOrderId, redoReason = "Photocell alignment failed lux threshold test.") => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === workOrderId
          ? {
              ...wo,
              column: "IN_PROGRESS",
              statusBadge: "Redo Required",
              redoReason
            }
          : wo
      )
    );
    showWarningToast("Audit Rejected", `Ticket #${workOrderId} sent back to field crew for rectification.`);

    try {
      await api.rejectWorkOrderApi(workOrderId, redoReason);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const deleteWorkOrder = async (workOrderId) => {
    setWorkOrders((prev) => prev.filter((wo) => wo.id !== workOrderId));
    showInfoToast("Work Order Cancelled", `#${workOrderId} withdrawn from maintenance engine.`);

    try {
      await api.deleteWorkOrderApi(workOrderId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  // ----------------------------------------------------
  // TECHNICIAN QUEUE ACTIONS
  // ----------------------------------------------------
  const toggleTechnicianChecklist = async (checkId) => {
    setTechnicianQueue((prev) => {
      const updatedList = prev.activeJob.checklist.map((item) =>
        item.id === checkId ? { ...item, checked: !item.checked } : item
      );
      return {
        ...prev,
        activeJob: {
          ...prev.activeJob,
          checklist: updatedList
        }
      };
    });

    try {
      await api.toggleChecklistItemApi(checkId);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const setTechnicianProofAfter = async (dataUrl) => {
    setTechnicianQueue((prev) => ({
      ...prev,
      activeJob: {
        ...prev.activeJob,
        proofAfterUrl: dataUrl,
        proofAfterExif: `EXIF: 19.0728° N, 72.8998° E • ${new Date().toLocaleTimeString()} IST • ATTESTED`
      }
    }));
    showSuccessToast("After-Photo Captured", "Cryptographic EXIF tag stamped with GPS coordinates.");

    try {
      await api.setProofAfterApi(dataUrl);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  const submitProofAndCloseJob = async () => {
    const job = technicianQueue.activeJob;
    const allChecked = job.checklist.every((c) => c.checked);
    if (!allChecked) {
      showWarningToast("Incomplete Checklist", "Please verify all physical checklist items before closing.");
      return false;
    }

    // Move to QA
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === job.workOrderId
          ? {
              ...wo,
              column: "UNDER_REVIEW",
              evidenceReady: true,
              proofAfter: {
                label: "PROOF AFTER",
                note: "Technician repair attested & verified",
                exif: job.proofAfterExif || "EXIF: 19.0728° N, 72.8998° E",
                imageUrl: job.proofAfterUrl || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80"
              }
            }
          : wo
      )
    );

    // Update active job to next in queue
    showSuccessToast(
      "Ticket Submitted for QA Sign-Off",
      `Repair on ${job.poleTag} logged. Routing to next priority node ${technicianQueue.nextInQueue.poleTag}...`
    );

    setTechnicianQueue((prev) => ({
      ...prev,
      activeJob: {
        workOrderId: prev.nextInQueue.id,
        workOrderTag: `#${prev.nextInQueue.id}`,
        poleId: prev.nextInQueue.poleId,
        poleTag: prev.nextInQueue.poleTag,
        title: prev.nextInQueue.title,
        location: prev.nextInQueue.location,
        priority: "HIGH PRIORITY",
        hazardRating: "Check Photocell drift & Ballast voltage.",
        protocol: "PROTOCOL E-02",
        distance: "1.2 km away",
        targetPoleCoordinates: "19.0738° N, 72.9025° E",
        checklist: [
          { id: "sensor", label: "Cleaned Photocell Window", checked: true },
          { id: "calibrated", label: "Recalibrated 35 Lux Threshold", checked: false },
          { id: "tested", label: "Cycling Loop Tested", checked: false }
        ],
        proofBeforeUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        proofBeforeExif: "EXIF: 19.0738° N, 72.9025° E • 09:12:00 IST",
        proofAfterUrl: "",
        proofAfterExif: "EXIF: PENDING ATTEST",
        fieldSignerId: "TECH-RK-07"
      },
      nextInQueue: {
        id: "WO-2026-889",
        poleId: "LUM-W12-0922",
        poleTag: "Pole #0922",
        title: "Reflector Shield Bird Fouling",
        location: "Central Campus Lawn, Pathway 2",
        transit: "8 mins (2.4 km)"
      }
    }));

    try {
      await api.submitProofAndCloseJobApi();
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }

    return true;
  };

  const updateInventoryStock = async (itemId, delta) => {
    setTechnicianQueue((prev) => ({
      ...prev,
      vanInventory: prev.vanInventory.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stock: Math.max(0, item.stock + delta),
              alert: item.stock + delta <= 1
            }
          : item
      )
    }));
    showInfoToast("Van Inventory Updated", "RFID telemetry synchronized with Somaiya Central Depot.");

    try {
      await api.updateInventoryStockApi(itemId, delta);
    } catch (e) {
      console.warn('API sync warning:', e.message);
    }
  };

  // ----------------------------------------------------
  // EXPORT AUDIT REPORT
  // ----------------------------------------------------
  const exportAuditReport = () => {
    const csvContent = [
      ["LUMOS MUNICIPAL AUDIT REPORT", new Date().toISOString(), selectedWard],
      [],
      ["METRICS SUMMARY"],
      ["Citywide MTTR", "3.8 hours", "Target: <5.0h", "Status: Compliant"],
      ["SLA Compliance Rate", "97.4%", "Violations: 32", "Target: >95%"],
      ["Energy Conservation", "418.2 MWh", "CO2 Saved: 142 tons", "Surplus: -28.4%"],
      ["Work Orders Cleared", "1,248 tickets", "Avg Unit Cost: $34.20"],
      [],
      ["SECTOR PERFORMANCE"],
      ["Sector", "MTTR (Hours)", "Target", "Status", "Notes"],
      ["Ward 12 (Somaiya - Central Tech)", "3.8", "5.0", "Compliant", "Nominal mesh uptime 99.8%"],
      ["Ward 04 (Industrial Harbor)", "6.2", "5.0", "Breached", "Penalty $4,800 withheld due to underground splice delays"],
      ["Ward 08 (Coastal Promenade)", "4.1", "5.0", "Compliant", "Salt spray corrosion prevention applied"],
      [],
      ["CURRENT WORK ORDERS SNAPSHOT"],
      ["WO ID", "Pole Tag", "Title", "Priority", "Status", "Technician", "Voltage"],
      ...workOrders.map((wo) => [
        wo.id,
        wo.poleTag,
        `"${wo.title.replace(/"/g, '""')}"`,
        wo.priorityLevel,
        wo.column,
        wo.technicianName || "Unassigned",
        wo.voltage || "230V"
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    downloadCSV(`LUMOS_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
    showSuccessToast("Audit Report Exported", "Comprehensive CSV downloaded to your device.");
  };

  return (
    <LumosContext.Provider
      value={{
        // Poles
        poles,
        selectedPole,
        selectedPoleId,
        setSelectedPoleId,
        activeGisFilter,
        setActiveGisFilter,
        registerPole,
        updatePole,
        deletePole,
        pingPoleTelemetry,
        isRegisterPoleOpen,
        setIsRegisterPoleOpen,
        cadOverlayPole,
        setCadOverlayPole,

        // Grievances
        grievances,
        grievanceTab,
        setGrievanceTab,
        fileGrievance,

        // AI Intakes
        aiIntakes,
        selectedIntake,
        selectedIntakeId,
        setSelectedIntakeId,
        reclassifyIntake,
        flagDuplicate,
        markFalseAlarm,
        approveWorkOrderFromTriage,

        // Work Orders
        workOrders,
        workOrderFilterPriority,
        setWorkOrderFilterPriority,
        workOrderFilterCrew,
        setWorkOrderFilterCrew,
        workOrderSearch,
        setWorkOrderSearch,
        createWorkOrder,
        dispatchWorkOrder,
        approveAndCloseWorkOrder,
        rejectWorkOrder,
        deleteWorkOrder,
        isCreateWorkOrderOpen,
        setIsCreateWorkOrderOpen,

        // Technician Queue
        technicianQueue,
        toggleTechnicianChecklist,
        setTechnicianProofAfter,
        submitProofAndCloseJob,
        updateInventoryStock,

        // Analytics
        analytics,
        analyticsWindow,
        setAnalyticsWindow,
        exportAuditReport,

        // General
        selectedWard,
        setSelectedWard,
        inspectModalPole,
        setInspectModalPole,
        isBackendConnected
      }}
    >
      {children}
    </LumosContext.Provider>
  );
};

export const useLumos = () => {
  const context = useContext(LumosContext);
  if (!context) {
    throw new Error('useLumos must be used within a LumosProvider');
  }
  return context;
};
