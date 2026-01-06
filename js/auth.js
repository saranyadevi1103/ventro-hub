import { ls, qs, toast } from "./utils.js";

function handleSignup() {
  const form = qs("#signupForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = qs("#suName").value.trim();
    const email = qs("#suEmail").value.trim().toLowerCase();
    const password = qs("#suPass").value;

    if (!name || !email || !password) return toast("Please fill all fields.");
    const users = ls.get("vh_users", []);
    if (users.find(u => u.email === email)) return toast("Email already exists.");
    users.push({ name, email, password });
    ls.set("vh_users", users);
    toast("Signup successful. Please login.");
    location.href = "login.html";
  });
}

function handleLogin() {
  const form = qs("#loginForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = qs("#liEmail").value.trim().toLowerCase();
    const password = qs("#liPass").value;
    const users = ls.get("vh_users", []);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return toast("Invalid credentials.");
    ls.set("vh_user", { name: user.name, email: user.email });
    toast("Login successful.");
    location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  handleSignup();
  handleLogin();
});