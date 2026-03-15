const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to make API requests
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authentication token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('[API Error]', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email, password, name) =>
    apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  getProfile: () => apiCall('/api/auth/profile'),
};

// User APIs
export const userAPI = {
  getProfile: () => apiCall('/api/user/profile'),
  
  updateProfile: (data) =>
    apiCall('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateSettings: (settings) =>
    apiCall('/api/user/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  getSettings: () => apiCall('/api/user/settings'),
};

// Report APIs
export const reportAPI = {
  uploadReport: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'POST',
      headers: {},
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/reports/upload`, config);
    
    if (!response.ok) {
      throw new Error('Failed to upload report');
    }
    
    return await response.json();
  },

  getReports: () => apiCall('/api/reports'),

  getReport: (id) => apiCall(`/api/reports/${id}`),

  deleteReport: (id) =>
    apiCall(`/api/reports/${id}`, { method: 'DELETE' }),

  analyzeReport: (reportId) =>
    apiCall(`/api/reports/${reportId}/analyze`, { method: 'POST' }),
};

// Medicine APIs
export const medicineAPI = {
  search: (query, limit = 10) =>
    apiCall(`/api/medicines/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  getDetails: (medicineId) =>
    apiCall(`/api/medicines/${medicineId}`),

  checkInteractions: (medicineIds) =>
    apiCall('/api/medicines/interactions', {
      method: 'POST',
      body: JSON.stringify({ medicine_ids: medicineIds }),
    }),

  getMedicineList: () => apiCall('/api/medicines'),
};

// Health Trends APIs
export const healthTrendsAPI = {
  getBloodSugarTrends: (days = 30) =>
    apiCall(`/api/health/trends/blood-sugar?days=${days}`),

  getCholesterolTrends: (days = 30) =>
    apiCall(`/api/health/trends/cholesterol?days=${days}`),

  getBloodPressureTrends: (days = 30) =>
    apiCall(`/api/health/trends/blood-pressure?days=${days}`),

  getAllTrends: (days = 30) =>
    apiCall(`/api/health/trends?days=${days}`),

  addHealthMetric: (metricType, value, date = new Date().toISOString()) =>
    apiCall('/api/health/metrics', {
      method: 'POST',
      body: JSON.stringify({ metric_type: metricType, value, date }),
    }),
};

// Reminders APIs
export const remindersAPI = {
  getReminders: () => apiCall('/api/reminders'),

  getTodayReminders: () => apiCall('/api/reminders/today'),

  getUpcomingReminders: (days = 7) =>
    apiCall(`/api/reminders/upcoming?days=${days}`),

  createReminder: (reminderData) =>
    apiCall('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    }),

  updateReminder: (reminderId, reminderData) =>
    apiCall(`/api/reminders/${reminderId}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData),
    }),

  deleteReminder: (reminderId) =>
    apiCall(`/api/reminders/${reminderId}`, { method: 'DELETE' }),

  markAsCompleted: (reminderId) =>
    apiCall(`/api/reminders/${reminderId}/complete`, { method: 'POST' }),
};

// Health Records APIs
export const healthRecordsAPI = {
  getRecords: () => apiCall('/api/health-records'),

  uploadRecord: async (file, recordType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', recordType);

    const config = {
      method: 'POST',
      headers: {},
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/health-records/upload`, config);
    
    if (!response.ok) {
      throw new Error('Failed to upload record');
    }
    
    return await response.json();
  },

  deleteRecord: (recordId) =>
    apiCall(`/api/health-records/${recordId}`, { method: 'DELETE' }),

  downloadRecord: (recordId) =>
    apiCall(`/api/health-records/${recordId}/download`),
};

// Emergency Card APIs
export const emergencyCardAPI = {
  getCard: () => apiCall('/api/emergency-card'),

  updateCard: (cardData) =>
    apiCall('/api/emergency-card', {
      method: 'PUT',
      body: JSON.stringify(cardData),
    }),

  addEmergencyContact: (contact) =>
    apiCall('/api/emergency-card/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    }),

  updateEmergencyContact: (contactId, contact) =>
    apiCall(`/api/emergency-card/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    }),

  deleteEmergencyContact: (contactId) =>
    apiCall(`/api/emergency-card/contacts/${contactId}`, { method: 'DELETE' }),
};

// AI Pharmacist APIs
export const aiPharmacistAPI = {
  sendMessage: (message) =>
    apiCall('/api/ai-pharmacist/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getChatHistory: () => apiCall('/api/ai-pharmacist/history'),

  clearChatHistory: () =>
    apiCall('/api/ai-pharmacist/history', { method: 'DELETE' }),
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => apiCall('/api/dashboard/summary'),

  getRecentActivity: () => apiCall('/api/dashboard/activity'),

  getHealthOverview: () => apiCall('/api/dashboard/health-overview'),
};
