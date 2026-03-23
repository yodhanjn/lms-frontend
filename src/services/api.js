import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Retry once on 502/503/504 or network error (e.g. Render free tier waking up)
const RETRY_STATUSES = [502, 503, 504];
const RETRY_DELAY_MS = 20000;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    const serverUnavailable =
      !err.response || RETRY_STATUSES.includes(err.response?.status);
    const isRetryable =
      serverUnavailable &&
      config &&
      !config.__retried &&
      !config.url?.includes('/health');

    if (isRetryable) {
      config.__retried = true;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return api.request(config);
    }

    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }

    const isServerWakeup =
      err.response &&
      RETRY_STATUSES.includes(err.response.status) &&
      !config?.url?.includes('/health');
    if (isServerWakeup) {
      if (!err.response) err.response = { data: {} };
      err.response.data = err.response.data || {};
      err.response.data.message =
        'Backend is starting up. Please try again in a moment.';
    }

    const isNetworkError = !err.response && !config?.url?.includes('/health');
    if (isNetworkError) {
      err.response = { data: {} };
      err.response.data.message =
        'Cannot reach backend API. Check backend status and VITE_API_URL.';
    }

    return Promise.reject(err);
  }
);

export default api;

export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const courses = {
  list: (params) => api.get('/courses', { params }),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const lessons = {
  getByCourse: (courseId) => api.get(`/courses/${courseId}/lessons`),
};

export const sections = {
  add: (courseId, data) => api.post(`/courses/${courseId}/sections`, data),
};

export const lessonsApi = {
  add: (sectionId, data) => api.post(`/sections/${sectionId}/lessons`, data),
};

export const enrollments = {
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
  getMyLearning: () => api.get('/enrollments/my-learning'),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getEnrollment: (courseId) => api.get(`/courses/${courseId}/enrollment`),
};

export const progress = {
  complete: (courseId, lessonId) => api.post('/progress/complete', { courseId, lessonId }),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  updateLastWatched: (courseId, lessonId) =>
    api.patch('/progress/last-watched', { courseId, lessonId }),
};

export const ai = {
  chat: (message, history = []) => api.post('/ai/chat', { message, history }),
};
