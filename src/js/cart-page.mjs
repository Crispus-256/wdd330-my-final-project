import { clearCart, getCartItems, removeFromCart } from "./cart-storage.mjs";
import { normalizeExternalImageUrl } from "./utils.mjs";

// Notify other pages (like header) of cart updates
function notifyCartUpdated() {
  window.dispatchEvent(new Event("storage"));
}

const cartElement = document.querySelector("[data-cart-list]");
const clearButton = document.querySelector("[data-clear-cart]");

function cartItemTemplate(item) {
  const name = (item.name || "Nail Product").trim();
  const image =
    normalizeExternalImageUrl(item.api_featured_image) ||
    normalizeExternalImageUrl(item.image_link) ||
    "/images/product-placeholder.svg";

  return `
    <li class="cart-item" data-product-id="${item.id}">
      <img src="${image}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='/images/product-placeholder.svg'" />
      <div class="cart-item__content">
        <h3>${name}</h3>
        <p>${item.brand || "Unbranded"}</p>
      </div>
      <button type="button" class="cart-item__remove" data-remove-id="${item.id}">Remove</button>
    </li>
  `;
}

function renderCart() {
  if (!cartElement) {
    return;
  }

  const cartItems = getCartItems();

  if (!cartItems.length) {
    cartElement.innerHTML = "<p class='cart-empty'>Your cart is empty. Add products from the home page.</p>";
    return;
  }

  cartElement.innerHTML = `<ul class="cart-list">${cartItems
    .map((item) => cartItemTemplate(item))
    .join("")}</ul>`;

  cartElement.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.removeId);
      notifyCartUpdated();
      renderCart();
    });
  });
}

if (cartElement) {
  renderCart();
}

if (clearButton) {
  clearButton.addEventListener("click", () => {
    clearCart();
    notifyCartUpdated();
    renderCart();
  });
}
