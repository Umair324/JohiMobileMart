import { api } from "./client";

function toQueryString(params) {
  const usp = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) value.forEach((v) => usp.append(key, v));
    else usp.append(key, value);
  });
  const str = usp.toString();
  return str ? `?${str}` : "";
}

export const listingsApi = {
  browse: (filters) => api.get(`/listings${toQueryString(filters)}`),
  detail: (id) => api.get(`/listings/${id}`),
  contact: (id) => api.get(`/listings/${id}/contact`),
  mine: () => api.get("/listings/mine"),
  create: (formData) => api.post("/listings", formData, { isFormData: true }),
  update: (id, payload) => api.put(`/listings/${id}`, payload),
  markSold: (id) => api.patch(`/listings/${id}/sold`),
  renew: (id) => api.patch(`/listings/${id}/renew`),
  remove: (id) => api.del(`/listings/${id}`),
  toggleFavorite: (id) => api.post(`/listings/${id}/favorite`),
  favorites: () => api.get("/listings/user/favorites"),
};
