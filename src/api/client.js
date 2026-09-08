const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

function getToken() {
  return localStorage.getItem("jmm_token");
}

async function request(path, { method = "GET", body, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(
      "Can't reach the Johi Mobile Mart server. Make sure the backend is running (see server/README.md)."
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, opts = {}) => request(path, { method: "POST", body, ...opts }),
  put: (path, body, opts = {}) => request(path, { method: "PUT", body, ...opts }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};

export function isUploadedImage(image) {
  return typeof image === "string" && (image.startsWith("/uploads") || image.startsWith("http"));
}

export function resolveImageUrl(image) {
  if (!image) return "";
  return image.startsWith("http") ? image : `${API_ORIGIN}${image}`;
}