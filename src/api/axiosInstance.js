import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ─── REQUEST INTERCEPTOR ─────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mxm_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ─── RESPONSE INTERCEPTOR ────────────────────────────── */
let isLoggingOut = false; // prevent duplicate logout from parallel requests

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      // Only 401 = token invalid/expired → logout
      // 403 = forbidden (permission issue) → do NOT logout, just reject
      if (status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        localStorage.removeItem('mxm_access_token');
        localStorage.removeItem('mxm_user');
        // Fire event so AuthContext can update React state cleanly
        window.dispatchEvent(new Event('mxm:logout'));
        setTimeout(() => { isLoggingOut = false; }, 3000);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
