import { ls, qs, formatINR, toast } from "./utils.js";

function renderCart() {
  const list = qs("#cartList");
  const totalEl = qs("#cartTotal");
  const cart = ls.get("vh_cart", []);
  if (!list || !totalEl) return;

  if (cart.length === 0) {
    list.innerHTML = `<div class="section-title">Your cart is empty.</div>`;
    totalEl.textContent = formatINR(0);
    return;
  }

  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <div><strong>${item.name}</strong></div>
        <div>${formatINR(item.price)}</div>
      </div>
      <div class="qty">
        <button class="btn-sm" data-dec="${idx}">-</button>
        <span>${item.qty}</span>
        <button class="btn-sm" data-inc="${idx}">+</button>
        <button class="btn-sm" data-del="${idx}" style="margin-left:8px;">Remove</button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = formatINR(total);

  document.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => changeQty(Number(b.dataset.inc), 1)));
  document.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => changeQty(Number(b.dataset.dec), -1)));
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => removeItem(Number(b.dataset.del))));
}

function changeQty(index, delta) {
  const cart = ls.get("vh_cart", []);
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  ls.set("vh_cart", cart);
  renderCart();
}

function removeItem(index) {
  const cart = ls.get("vh_cart", []);
  cart.splice(index, 1);
  ls.set("vh_cart", cart);
  renderCart();
}

function handleCheckout() {
  const form = qs("#checkoutForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = qs("#coName").value.trim();
    const address = qs("#coAddress").value.trim();
    const phone = qs("#coPhone").value.trim();
    const payment = qs("#coPayment").value;

    if (!name || !address || !phone || !payment) return toast("Please fill all fields.");
    const order = {
      id: Date.now(),
      items: ls.get("vh_cart", []),
      total: ls.get("vh_cart", []).reduce((s,i)=>s+i.price*i.qty,0),
      customer: { name, address, phone, payment },
      createdAt: new Date().toISOString()
    };
    const orders = ls.get("vh_orders", []);
    orders.push(order);
    ls.set("vh_orders", orders);
    ls.set("vh_cart", []);
    toast("Order placed successfully!");
    location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  handleCheckout();
});