// util helpers for LocalStorage and DOM

export const ls = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) { localStorage.removeItem(key); }
};

export function formatINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export function qs(sel, scope = document) { return scope.querySelector(sel); }
export function qsa(sel, scope = document) { return [...scope.querySelectorAll(sel)]; }

export function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

export function toast(message) {
  alert(message); // minimal, replace with custom UI if desired
}