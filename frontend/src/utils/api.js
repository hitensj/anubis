const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function fetchJSON(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  getShipments: () => fetchJSON('/shipments'),
  createShipment: (data) => fetchJSON('/shipments', { method: 'POST', body: JSON.stringify(data) }),
  deleteShipment: (id) => fetchJSON(`/shipments/${id}`, { method: 'DELETE' }),
  getChokepoints: () => fetchJSON('/chokepoints'),
  getNews: (region) => fetchJSON(`/news?region=${encodeURIComponent(region || '')}`),
  getAnalytics: () => fetchJSON('/analytics'),
  getAlerts: () => fetchJSON('/alerts'),
  predict: (data) => fetchJSON('/predict', { method: 'POST', body: JSON.stringify(data) }),
  simulateCascade: (id) => fetchJSON(`/cascade/${id}`)
};
