import { ls, qs } from "./utils.js";

function renderHeaderUser() {
  const user = ls.get("vh_user");
  const el = qs("#userArea");
  if (!el) return;
  if (user?.name) {
    el.innerHTML = `<span>Welcome, ${user.name}</span> <a class="btn" id="logoutBtn" href="#">Logout</a>`;
    const logout = qs("#logoutBtn");
    logout?.addEventListener("click", (e) => {
      e.preventDefault();
      ls.remove("vh_user");
      location.reload();
    });
  } else {
    el.innerHTML = `<a href="login.html" class="btn">Login</a><a href="signup.html" class="btn">Signup</a>`;
  }
}

function renderCartCount() {
  const cart = ls.get("vh_cart", []);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = qs("#cartCount");
  if (el) el.textContent = count;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeaderUser();
  renderCartCount();
});