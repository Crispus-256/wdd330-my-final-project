import { normalizeExternalImageUrl, renderListWithTemplate } from "./utils.mjs";
import { filterProductsByTerm } from "./search-filter.mjs";

export default class ProductList {
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
    this.initialProducts = [];
    this.allProducts = [];
  }

  isRenderableProduct(product) {
    return Boolean(
      product?.product_type === "nail_polish" &&
        product?.name &&
        (product?.price || product?.price === "0")
    );
  }

  productCardTemplate(product) {
    const fallbackImage = "/images/product-placeholder.svg";
    const featuredImage = normalizeExternalImageUrl(product.api_featured_image);
    const imageLink = normalizeExternalImageUrl(product.image_link);
    const image = featuredImage || imageLink || fallbackImage;
    const name = (product.name || "Nail Product").trim();
    const brand = (product.brand || "Unbranded").trim();
    const rawPrice = Number.parseFloat(product.price);
    const formattedPrice = Number.isFinite(rawPrice)
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(rawPrice)
      : "$0.00";

    const productId = product.id ?? "";

    return `
      <li class="product-card" data-brand="${brand.toLowerCase()}">
        <a class="product-card__link" href="/product/index.html?id=${productId}">
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
        </a>
      </li>
    `;
  }

  render(products = this.products) {
    renderListWithTemplate(
      this.productCardTemplate,
      this.listElement,
      products,
      true
    );
  }

  getProducts() {
    return this.products;
  }

  hasFullCatalogLoaded() {
    return this.allProducts.length > 0;
  }

  async searchProducts(term = "") {
    const normalizedTerm = term.trim();

    if (!normalizedTerm) {
      return this.initialProducts;
    }

    if (!this.allProducts.length) {
      const products = await this.dataSource.getAllNailPolishProducts();
      this.allProducts = products.filter((product) => this.isRenderableProduct(product));
    }

    return filterProductsByTerm(this.allProducts, normalizedTerm);
  }

  async init() {
    const products = await this.dataSource.getNailPolishProducts(10);
    this.initialProducts = products.filter((product) => this.isRenderableProduct(product));
    this.products = this.initialProducts;

    this.render(this.products);
  }
}
