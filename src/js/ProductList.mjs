import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  productCardTemplate(product) {
    const fallbackImage = "/images/product-placeholder.svg";
    const rawFeaturedImage = (product.api_featured_image || "").trim();
    const featuredImage = rawFeaturedImage.startsWith("//")
      ? `https:${rawFeaturedImage}`
      : rawFeaturedImage;
    const image = featuredImage || product.image_link || fallbackImage;
    const name = (product.name || "Nail Product").trim();
    const brand = (product.brand || "Unbranded").trim();
    const rawPrice = Number.parseFloat(product.price);
    const formattedPrice = Number.isFinite(rawPrice)
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(rawPrice)
      : "$0.00";

    return `
      <li class="product-card" data-brand="${brand.toLowerCase()}">
        <img
          src="${image}"
          alt="${name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${fallbackImage}';"
        />
        <div class="product-card__content">
          <h3>${name}</h3>
          <p class="product-card__brand">${brand}</p>
          <p class="product-card__price">${formattedPrice}</p>
        </div>
      </li>
    `;
  }

  async init() {
    const products = await this.dataSource.getNailPolishProducts(10);
    const filteredProducts = products.filter(
      (product) =>
        product.product_type === "nail_polish" &&
        product.name &&
        (product.price || product.price === "0")
    );

    console.log("Makeup API nail products:", filteredProducts);

    renderListWithTemplate(
      this.productCardTemplate,
      this.listElement,
      filteredProducts,
      true
    );
  }
}
