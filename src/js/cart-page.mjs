import { getLocalStorage } from "./utils.mjs";

const cartElement = document.querySelector("[data-cart-list]");
const cartItems = getLocalStorage("nailTrendScoutCart") || [];

if (cartElement) {
  cartElement.textContent = `Cart items saved for quote: ${cartItems.length}`;
}
