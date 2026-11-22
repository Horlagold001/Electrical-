
const products = [
  {
    id: 1, name: "Premium LED Bulb 12W", category: "Lighting",
    price: 2500, oldPrice: 3200, tag: "Popular",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, name: "Modern Ceiling Light", category: "Lighting",
    price: 18500, oldPrice: 22000, tag: "Featured",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3, name: "Electrical Copper Cable", category: "Wiring",
    price: 12500, oldPrice: 15000, tag: "Quality pick",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4, name: "Extension Socket 4-Way", category: "Accessories",
    price: 8500, oldPrice: 10000, tag: "Popular",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5, name: "Wall Socket Outlet", category: "Accessories",
    price: 3500, oldPrice: 4200, tag: "",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6, name: "Circuit Breaker", category: "Protection",
    price: 6500, oldPrice: 7800, tag: "Essential",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7, name: "Electrical Wall Switch", category: "Accessories",
    price: 2200, oldPrice: 2800, tag: "",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8, name: "Outdoor Security Light", category: "Lighting",
    price: 14500, oldPrice: 17000, tag: "Featured",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9, name: "PVC Electrical Conduit", category: "Wiring",
    price: 1800, oldPrice: 2200, tag: "",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10, name: "Distribution Board", category: "Protection",
    price: 22000, oldPrice: 26000, tag: "Quality pick",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11, name: "LED Ceiling Panel", category: "Lighting",
    price: 9500, oldPrice: 11500, tag: "",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12, name: "Cable Connector Pack", category: "Wiring",
    price: 3000, oldPrice: 3800, tag: "",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];
let activeCategory = "All";
let searchTerm = "";
let toastTimer;

function money(amount) {
  return "₦" + Number(amount).toLocaleString("en-NG");
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.add("hidden");
  });

  const target = document.getElementById(page + "Page");
  if (target) target.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "cart") renderCart();
  if (page === "checkout") renderCheckoutSummary();
}

function renderProducts() {
  let filtered = products.filter(product => {
    const categoryMatch =
      activeCategory === "All" || product.category === activeCategory;

    const searchMatch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return categoryMatch && searchMatch;
  });

  const sort = document.getElementById("sortSelect").value;

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  document.getElementById("productHeading").textContent =
    activeCategory === "All" ? "Popular products" : activeCategory + " products";

  const grid = document.getElementById("productGrid");

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-products">No products found. Try another search.</div>';
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="product-price">
          ${money(product.price)}
          <span class="product-old">${money(product.oldPrice)}</span>
        </div>
        <div class="product-rating">★★★★★ <span style="color:#888">Demo rating</span></div>
        <button class="add-button" onclick="addToCart(${product.id})">ADD TO CART</button>
      </div>
    </article>
  `).join("");
}

function filterCategory(category) {
  activeCategory = category;
  searchTerm = "";
  document.getElementById("searchInput").value = "";

  document.querySelectorAll(".filter").forEach(button => {
    button.classList.toggle(
      "active",
      button.textContent.trim().toLowerCase() === category.toLowerCase() ||
      (category === "All" && button.textContent.trim() === "All")
    );
  });

  showPage("home");
  renderProducts();
  document.getElementById("productsSection").scrollIntoView({ behavior: "smooth" });
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  showToast(product.name + " added to your cart");
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  renderCart();
  showToast("Product removed from cart");
}

function renderCart() {
  const container = document.getElementById("cartItems");

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <div>🛒</div>
        <h3>Your cart is empty</h3>
        <p class="muted">You haven't added any products yet.</p>
        <button class="primary-button" onclick="showPage('home')">Start shopping</button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <small>${item.category}</small>
          <div class="quantity-control">
            <button onclick="changeQuantity(${item.id}, -1)">−</button>
            <b>${item.quantity}</b>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="remove-button" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
        <div class="cart-item-price">${money(item.price * item.quantity)}</div>
      </div>
    `).join("");
  }

  document.getElementById("cartSubtotal").textContent = money(cartSubtotal());
  document.getElementById("cartTotal").textContent = money(cartSubtotal());
  document.getElementById("checkoutButton").disabled = cart.length === 0;
  document.getElementById("checkoutButton").style.opacity = cart.length ? "1" : ".5";
}

function startCheckout() {
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }

  showPage("checkout");
  checkoutStep(1);
}

function checkoutStep(step) {
  [1, 2, 3].forEach(number => {
    document.getElementById("checkoutStep" + number).classList.toggle("hidden", number !== step);
    document.getElementById("step" + number + "Label").classList.toggle("active", number === step);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  renderCheckoutSummary();
}

function deliveryPrice() {
  const selected = document.querySelector('input[name="delivery"]:checked');
  return selected && selected.value === "Express delivery" ? 5000 : 2500;
}

function renderCheckoutSummary() {
  const summary = document.getElementById("checkoutSummaryItems");

  summary.innerHTML = cart.map(item => `
    <div class="checkout-product">
      <span>${item.name} × ${item.quantity}</span>
      <b>${money(item.price * item.quantity)}</b>
    </div>
  `).join("");

  const subtotal = cartSubtotal();
  const delivery = deliveryPrice();

  document.getElementById("checkoutSubtotal").textContent = money(subtotal);
  document.getElementById("deliveryCost").textContent = money(delivery);
  document.getElementById("checkoutTotal").textContent = money(subtotal + delivery);
}

document.getElementById("customerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  if (!this.reportValidity()) return;

  checkoutStep(2);
});

document.querySelectorAll('input[name="delivery"]').forEach(input => {
  input.addEventListener("change", renderCheckoutSummary);
});

function placeDemoOrder() {
  if (!cart.length) {
    showToast("Your cart is empty");
    showPage("home");
    return;
  }

  const payment = document.querySelector('input[name="payment"]:checked');
  const delivery = document.querySelector('input[name="delivery"]:checked');

  const reference = "VE-DEMO-" + Math.floor(100000 + Math.random() * 900000);

  document.getElementById("orderReference").textContent =
    "Demo reference: " + reference;

  showPage("success");
}

function resetStore() {
  cart = [];
  updateCartCount();
  renderProducts();
  showPage("home");
  showToast("Welcome back to VoltEdge");
}

document.getElementById("searchForm").addEventListener("submit", function(event) {
  event.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  activeCategory = "All";
  renderProducts();
  document.getElementById("productsSection").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchInput").addEventListener("input", function() {
  searchTerm = this.value.trim().toLowerCase();
  activeCategory = "All";
  renderProducts();
});

document.getElementById("sortSelect").addEventListener("change", renderProducts);

document.getElementById("wholesaleForm").addEventListener("submit", function(event) {
  event.preventDefault();

  if (!this.reportValidity()) return;

  this.reset();
  showToast("Demo enquiry preview completed. Nothing was sent.");
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

renderProducts();
updateCartCount();
