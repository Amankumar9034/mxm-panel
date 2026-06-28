import api from './axiosInstance';

/* ─── PANEL AUTH ───────────────────────────────────────── */
export const sendOtp = (phone) =>
  api.post('/panel/auth/phone/send-otp', { phone });

export const verifyOtp = (phone, otp) =>
  api.post('/panel/auth/phone/verify-otp', { phone, otp });

/* ─── PANEL USER ───────────────────────────────────────── */
export const getMyProfile = () =>
  api.get('/panel/user');

export const getUserList = (params = {}) =>
  api.get('/panel/user/list', { params });

export const getUserById = (id) =>
  api.get(`/panel/user/${id}`);

export const updateUser = (id, data) =>
  api.patch(`/panel/user/${id}`, data);

export const updateUserStatus = (id, isActive) =>
  api.patch(`/panel/user/${id}/status`, { isActive });

export const deleteUserAdmin = (id) =>
  api.patch(`/panel/user/${id}/delete`);

/* ─── PANEL CATEGORY ──────────────────────────────────── */
export const createCategory = (formData) =>
  api.post('/panel/category', formData);

export const getCategoryList = (params = {}) =>
  api.get('/panel/category/list', { params });

export const getCategoryById = (id) =>
  api.get(`/panel/category/${id}`);

export const updateCategory = (id, formData) =>
  api.patch(`/panel/category/${id}`, formData);

export const updateCategoryStatus = (id, isActive) =>
  api.patch(`/panel/category/${id}/status`, { isActive });

export const deleteCategory = (id) =>
  api.delete(`/panel/category/${id}`);
