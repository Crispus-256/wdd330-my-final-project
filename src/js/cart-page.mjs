import { clearCart, getCartItems, removeFromCart } from "./cart-storage.mjs";

const cartElement = document.querySelector("[data-cart-list]");
const clearButton = document.querySelector("[data-clear-cart]");

function cartItemTemplate(item) {
  return `
    <li class="cart-item" data-product-id="${item.id}">
      <img src="${item.image_link || "/images/product-placeholder.svg"}" alt="${item.name}" loading="lazy" />
      <div class="cart-item__content">
        <h3>${item.name || "Nail Product"}</h3>
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
    cartElement.innerHTML = "<p>Your cart is empty. Add products from the home page.</p>";
    return;
  }

  cartElement.innerHTML = `<ul class="cart-list">${cartItems
    .map((item) => cartItemTemplate(item))
    .join("")}</ul>`;

  cartElement.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.removeId);
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
    renderCart();
  });
}
