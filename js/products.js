import { ls, qs, qsa, formatINR, toast } from "./utils.js";

let PRODUCTS = [];
let SORT = "newest";
let CATEGORY = "all";

async function loadProducts() {
  const res = await fetch("./data/products.json");
  PRODUCTS = await res.json();
  renderProducts();
}

function applyFilters(list) {
  let arr = [...list];
  if (CATEGORY !== "all") arr = arr.filter(p => p.category === CATEGORY);
  if (SORT === "priceAsc") arr.sort((a,b)=> a.price - b.price);
  if (SORT === "newest") arr.sort((a,b)=> b.id - a.id);
  return arr;
}

function renderProducts() {
  const grid = qs("#productsGrid");
  if (!grid) return;
  const filtered = applyFilters(PRODUCTS);
  grid.innerHTML = filtered.map(p => `
    <div class="card">
      <img class="card-img" src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-price">${formatINR(p.price)}</div>
        <div class="card-actions">
          <button class="btn-sm" data-add="${p.id}">Add to Cart</button>
          <a class="btn-sm gold" href="product.html?id=${p.id}">Buy Now</a>
        </div>
      </div>
    </div>
  `).join("");

  qsa("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
  });
}

function addToCart(id) {
  const cart = ls.get("vh_cart", []);
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const found = cart.find(c => c.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, name: product.name, price: product.price, image: product.image, qty: 1 });
  ls.set("vh_cart", cart);
  toast("Added to cart.");
  const el = document.querySelector("#cartCount");
  if (el) el.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function bindFilters() {
  const catSel = qs("#filterCategory");
  const sortSel = qs("#sort");
  catSel?.addEventListener("change", e => { CATEGORY = e.target.value; renderProducts(); });
  sortSel?.addEventListener("change", e => { SORT = e.target.value; renderProducts(); });
}

document.addEventListener("DOMContentLoaded", () => {
  bindFilters();
  loadProducts();
});