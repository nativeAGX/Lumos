export const APP_NAME = "LUMOS MUNICIPAL";
export const MUNICIPAL_CORP = "Municipal Corporation of Greater Mumbai / Smart City Governance Framework";
export const EMERGENCY_HELPLINE = "1800-425-001";

export const USER_ROLES = {
  WARD_OFFICER: {
    id: "ward_officer",
    title: "Ward Officer / Municipal In-Charge",
    name: "Dr. Sandeep Deshmukh",
    email: "officer.deshmukh@somaiya.gov.in",
    ward: "Ward 12 — Somaiya Vidyavihar",
    type: "OPERATIONS",
    badge: "Tier-3 Auth",
    avatar: "SD"
  },
  FIELD_TECH: {
    id: "field_tech",
    title: "Field Lead Technician",
    name: "Rajesh Kumar",
    unit: "Somaiya Unit #07",
    email: "rajesh.k@field.lumos.gov.in",
    ward: "Ward 12 Electrical Cell",
    type: "OPERATIONS",
    badge: "Field Ops",
    avatar: "RK"
  },
  CITIZEN: {
    id: "citizen",
    title: "Registered Resident",
    name: "Rahul M.",
    phone: "+91 98201 44820",
    email: "rahul.m@somaiya.edu",
    ward: "Ward 12 Somaiya Campus",
    type: "CITIZEN",
    badge: "Verified Resident",
    avatar: "RM"
  }
};

export const POLE_STATUSES = {
  HEALTHY: { label: "100% On", color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  DIMMED: { label: "Dimmed (Scheduled)", color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  CRITICAL: { label: "Tripped / Drop", color: "text-rose-600 bg-rose-50 border-rose-200", dot: "bg-rose-500" }
};

export const FAULT_TYPES = [
  {
    id: "blackout",
    title: "Complete Blackout / Dark Lamp",
    subtitle: "Total illumination loss on pole",
    priority: "HIGH",
    urgencyText: "Night Vision Risk",
    icon: "Moon"
  },
  {
    id: "flickering",
    title: "Flickering / Strobe",
    subtitle: "Unstable ballast or driver pulse",
    priority: "MEDIUM",
    urgencyText: "Strobe Hazard",
    icon: "ZapOff"
  },
  {
    id: "sparking",
    title: "Exposed Wires / Sparking",
    subtitle: "Physical safety risk to public",
    priority: "CRITICAL",
    urgentBadge: true,
    urgencyText: "URGENT SAFETY RISK",
    icon: "AlertTriangle"
  },
  {
    id: "collision",
    title: "Damaged Pole / Collision",
    subtitle: "Structural tilt, dent, or broken arm",
    priority: "HIGH",
    urgencyText: "Structural Hazard",
    icon: "ShieldAlert"
  }
];

export const WARDS_LIST = [
  "Ward 12 — Somaiya Vidyavihar",
  "Ward 04 — Industrial Harbor",
  "Ward 08 — Coastal Promenade",
  "Ward 02 — Malabar Gateway",
  "Ward 07 — Bandra Kurla Corridor"
];
