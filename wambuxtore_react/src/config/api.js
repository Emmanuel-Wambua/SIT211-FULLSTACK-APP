const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api';

function normalizeApiBase(value) {
  const base = (value || DEFAULT_API_BASE).replace(/\/+$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

export const API_BASE = normalizeApiBase(process.env.REACT_APP_API_BASE_URL);
