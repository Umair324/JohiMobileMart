import { api } from "./client";

export const wantedApi = {
  browse: () => api.get("/wanted"),
  mine: () => api.get("/wanted/mine"),
  create: (payload) => api.post("/wanted", payload),
  remove: (id) => api.del(`/wanted/${id}`),
};

export const messagesApi = {
  start: (payload) => api.post("/messages/start", payload),
  conversations: () => api.get("/messages/conversations"),
  thread: (id) => api.get(`/messages/conversations/${id}`),
  send: (id, text) => api.post(`/messages/conversations/${id}`, { text }),
};

export const reportsApi = {
  create: (payload) => api.post("/reports", payload),
};

export const contactApi = {
  send: (payload) => api.post("/contact", payload),
};

export const adminApi = {
  stats: () => api.get("/admin/stats"),
  listings: (params = {}) => {
    const usp = new URLSearchParams(params).toString();
    return api.get(`/admin/listings${usp ? `?${usp}` : ""}`);
  },
  approveListing: (id) => api.patch(`/admin/listings/${id}/approve`),
  rejectListing: (id) => api.patch(`/admin/listings/${id}/reject`),
  deleteListing: (id) => api.del(`/admin/listings/${id}`),
  users: () => api.get("/admin/users"),
  toggleSuspend: (id) => api.patch(`/admin/users/${id}/suspend`),
  reports: () => api.get("/admin/reports"),
  resolveReport: (id) => api.del(`/admin/reports/${id}`),
  wanted: () => api.get("/admin/wanted"),
  deleteWanted: (id) => api.del(`/admin/wanted/${id}`),
  contactMessages: () => api.get("/admin/contact-messages"),
  resolveContactMessage: (id) => api.del(`/admin/contact-messages/${id}`),
};