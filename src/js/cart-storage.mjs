import { CART_STORAGE_KEY } from "./constants.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export function getCartItems() {
  return getLocalStorage(CART_STORAGE_KEY) || [];
}

export function addToCart(product) {
  const currentItems = getCartItems();
  const hasItem = currentItems.some((item) => String(item.id) === String(product.id));

  if (hasItem) {
    return currentItems;
  }

  const updatedItems = [...currentItems, product];
  setLocalStorage(CART_STORAGE_KEY, updatedItems);
  return updatedItems;
}

export function removeFromCart(productId) {
  const updatedItems = getCartItems().filter(
    (item) => String(item.id) !== String(productId)
  );
  setLocalStorage(CART_STORAGE_KEY, updatedItems);
  return updatedItems;
}

export function clearCart() {
  setLocalStorage(CART_STORAGE_KEY, []);
  return [];
}
