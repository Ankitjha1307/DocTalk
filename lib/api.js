

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://doctalk-production-a83f.up.railway.app";

// ── Core fetch wrapper ────────────────────────────────────────
async function apiCall(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API error ${response.status}`);
  }

  return response.json();
}

// ── Medicine ──────────────────────────────────────────────────

export const medicineAPI = {
  search: (query) =>
    apiCall(`/api/medicine/search?query=${encodeURIComponent(query)}`),

  checkInteractions: (medicines) =>
    apiCall("/api/medicine/interactions", {
      method: "POST",
      body: JSON.stringify({ medicines }),
    }),

  ask: (question) =>
    apiCall("/api/medicine/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
};

// ── Report ────────────────────────────────────────────────────

export const reportAPI = {
  analyzeReport: (fileOrText) => {

    if (fileOrText instanceof File) {
      const formData = new FormData();
      formData.append("file", fileOrText);
      return fetch(`${API_BASE}/api/report/analyze`, {
        method: "POST",
        body: formData,
        headers: (() => {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("auth_token")
              : null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        })(),
      }).then((r) => r.json());
    }

    return apiCall("/api/report/analyze", {
      method: "POST",
      body: JSON.stringify({ text: fileOrText }),
    });
  },
};

// ── Chat (AI Pharmacist) ──────────────────────────────────────

export const aiPharmacistAPI = {
  sendMessage: (message) =>
    apiCall("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

// ── Reminders ─────────────────────────────────────────────────

export const remindersAPI = {
  getReminders: () => apiCall("/api/reminder"),

  createReminder: (data) =>
    apiCall("/api/reminder", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getReminder: (id) => apiCall(`/api/reminder/${id}`),

  updateReminder: (id, data) =>
    apiCall(`/api/reminder/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteReminder: (id) =>
    apiCall(`/api/reminder/${id}`, { method: "DELETE" }),

  toggleReminder: (id) =>
    apiCall(`/api/reminder/${id}/toggle`, { method: "PATCH" }),
};

// ── Health Metrics ────────────────────────────────────────────

export const healthTrendsAPI = {
  getMetrics: () => apiCall("/api/health/metrics"),
  getSummary: () => apiCall("/api/health/summary"),
  getAlerts: () => apiCall("/api/health/alerts"),

  logMetric: (data) =>
    apiCall("/api/health/log", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Ping (health check) ───────────────────────────────────────
export const pingAPI = {
  ping: () => apiCall("/api/ping"),
};
