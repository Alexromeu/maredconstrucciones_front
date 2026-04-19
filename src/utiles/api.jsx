import convert_url from "./url_convert";

const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(endpoint, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(convert_url(endpoint), { ...options, headers });

  if (res.status === 401 && token) {
    setToken(null);
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return res;
}
