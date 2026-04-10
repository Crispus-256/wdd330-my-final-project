export function productDetailsTemplate(product) {
  const fallbackImage = "/images/product-placeholder.svg";
  const rawPrice = Number.parseFloat(product.price);
  const price = Number.isFinite(rawPrice)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(rawPrice)
    : "$0.00";

  const description =
    (product.description || "").trim() ||
    "No description provided by the product source.";

  return `
    <article class="product-details" data-product-id="${product.id}">
      <img src="${product.image_link || fallbackImage}" alt="${product.name}" />
      <div class="product-details__content">
        <h2>${product.name || "Nail Product"}</h2>
        <p><strong>Brand:</strong> ${product.brand || "Unbranded"}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p>${description}</p>
        <p>
          <a href="${product.product_link || "#"}" target="_blank" rel="noreferrer">View source product page</a>
        </p>
        <button type="button" class="add-to-cart-btn" data-add-to-cart>
          Add to Cart
        </button>
      </div>
    </article>
  `;
}
