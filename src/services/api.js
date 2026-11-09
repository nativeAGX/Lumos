import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach JWT Bearer token to all outgoing API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lumos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration or unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('lumos_token');
    }
    return Promise.reject(error);
  }
);

// Token helpers for teammates
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('lumos_token', token);
  } else {
    localStorage.removeItem('lumos_token');
  }
};

export const getAuthToken = () => localStorage.getItem('lumos_token');

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
export const checkBackendHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (error) {
    return null;
  }
};

// ----------------------------------------------------
// Poles & GIS Telemetry
// ----------------------------------------------------
export const fetchPoles = async (params = {}) => {
  const res = await api.get('/poles', { params });
  return res.data.data;
};

export const fetchPoleById = async (id) => {
  const res = await api.get(`/poles/${id}`);
  return res.data.data;
};

export const createPoleApi = async (poleData) => {
  const res = await api.post('/poles', poleData);
  return res.data.data;
};

export const updatePoleApi = async (id, updatedFields) => {
  const res = await api.put(`/poles/${id}`, updatedFields);
  return res.data.data;
};

export const deletePoleApi = async (id) => {
  const res = await api.delete(`/poles/${id}`);
  return res.data;
};

export const pingPoleApi = async (id) => {
  const res = await api.post(`/poles/${id}/ping`);
  return res.data;
};

// ----------------------------------------------------
// Grievances
// ----------------------------------------------------
export const fetchGrievances = async (status) => {
  const params = status && status !== 'ALL' ? { status } : {};
  const res = await api.get('/grievances', { params });
  return res.data.data;
};

export const createGrievanceApi = async (formData) => {
  const res = await api.post('/grievances', formData);
  return res.data;
};

export const updateGrievanceStatusApi = async (id, statusData) => {
  const res = await api.patch(`/grievances/${id}/status`, statusData);
  return res.data.data;
};

// ----------------------------------------------------
// AI Fault Intakes & Triage
// ----------------------------------------------------
export const fetchAiIntakes = async () => {
  const res = await api.get('/intakes');
  return res.data.data;
};

export const reclassifyIntakeApi = async (id, newDefect, newPriority) => {
  const res = await api.patch(`/intakes/${id}/reclassify`, { newDefect, newPriority });
  return res.data.data;
};

export const flagDuplicateApi = async (id) => {
  const res = await api.patch(`/intakes/${id}/duplicate`);
  return res.data.data;
};

export const markFalseAlarmApi = async (id) => {
  const res = await api.delete(`/intakes/${id}/false-alarm`);
  return res.data;
};

export const approveWorkOrderFromTriageApi = async (id) => {
  const res = await api.post(`/intakes/${id}/approve-work-order`);
  return res.data;
};

// ----------------------------------------------------
// Work Orders
// ----------------------------------------------------
export const fetchWorkOrders = async (filters = {}) => {
  const res = await api.get('/work-orders', { params: filters });
  return res.data.data;
};

export const createWorkOrderApi = async (woData) => {
  const res = await api.post('/work-orders', woData);
  return res.data.data;
};

export const dispatchWorkOrderApi = async (id, crewName) => {
  const res = await api.patch(`/work-orders/${id}/dispatch`, { crewName });
  return res.data.data;
};

export const approveAndCloseWorkOrderApi = async (id) => {
  const res = await api.patch(`/work-orders/${id}/approve-close`);
  return res.data.data;
};

export const rejectWorkOrderApi = async (id, redoReason) => {
  const res = await api.patch(`/work-orders/${id}/reject`, { redoReason });
  return res.data.data;
};

export const deleteWorkOrderApi = async (id) => {
  const res = await api.delete(`/work-orders/${id}`);
  return res.data;
};

// ----------------------------------------------------
// Technician Queue & Van Inventory
// ----------------------------------------------------
export const fetchTechnicianQueue = async () => {
  const res = await api.get('/technician/queue');
  return res.data.data;
};

export const toggleChecklistItemApi = async (checkId) => {
  const res = await api.patch(`/technician/checklist/${checkId}`);
  return res.data.data;
};

export const setProofAfterApi = async (dataUrl) => {
  const res = await api.patch('/technician/proof-after', { dataUrl });
  return res.data.data;
};

export const submitProofAndCloseJobApi = async () => {
  const res = await api.post('/technician/submit-job');
  return res.data;
};

export const updateInventoryStockApi = async (itemId, delta) => {
  const res = await api.patch(`/technician/inventory/${itemId}`, { delta });
  return res.data.data;
};

// ----------------------------------------------------
// Analytics
// ----------------------------------------------------
export const fetchAnalytics = async () => {
  const res = await api.get('/analytics');
  return res.data.data;
};

// ----------------------------------------------------
// Authentication & JWT
// ----------------------------------------------------
export const loginApi = async (emailOrRole, passwordOrEmail, maybePassword) => {
  let email, password;
  if (maybePassword !== undefined) {
    email = passwordOrEmail;
    password = maybePassword;
  } else {
    email = emailOrRole;
    password = passwordOrEmail;
  }

  const res = await api.post('/auth/login', { email, password });
  if (res.data?.token) {
    localStorage.setItem('lumos_token', res.data.token);
  }
  return res.data;
};

export const registerApi = async (userData) => {
  const res = await api.post('/auth/register', userData);
  if (res.data?.token) {
    localStorage.setItem('lumos_token', res.data.token);
  }
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

export const fetchUsersApi = async () => {
  const res = await api.get('/auth/users');
  return res.data.data;
};

export default api;

