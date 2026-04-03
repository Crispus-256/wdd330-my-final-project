import { getParam } from "./utils.mjs";

const detailsElement = document.querySelector("[data-product-details]");
const productId = getParam("id");

if (detailsElement) {
  detailsElement.textContent = productId
    ? `Product quick view coming soon for item ${productId}.`
    : "Choose a product from the home page to see details here.";
}
