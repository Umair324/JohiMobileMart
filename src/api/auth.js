import { api } from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  google: (credential, intent) => api.post("/auth/google", { credential, intent }),
  me: () => api.get("/auth/me"),
  updateProfile: (payload) =>
    api.put("/auth/me", payload, { isFormData: payload instanceof FormData }),
  completeProfile: (payload) => api.put("/auth/complete-profile", payload),
};