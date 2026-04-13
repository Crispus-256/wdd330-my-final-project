import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { addToCart } from "./cart-storage.mjs";
import { productDetailsTemplate } from "./product-details-renderer.mjs";

const detailsElement = document.querySelector("[data-product-details]");
const productId = getParam("id");
const productService = new ExternalServices();

function renderMessage(message) {
  if (detailsElement) {
    detailsElement.innerHTML = `<p class="gallery-empty" role="status">${message}</p>`;
  }
}

if (detailsElement) {
  if (!productId) {
    renderMessage("Choose a product from the home page to see details here.");
  } else {
    const product = await productService.getProductById(productId);

    if (!product) {
      renderMessage("The selected product could not be found.");
    } else {
      detailsElement.innerHTML = productDetailsTemplate(product);

      const addButton = detailsElement.querySelector("[data-add-to-cart]");
      if (addButton) {
        addButton.addEventListener("click", () => {
          addToCart(product);
          window.dispatchEvent(new Event("storage"));
          addButton.textContent = "Added";
          addButton.disabled = true;
        });
      }
    }
  }
}
