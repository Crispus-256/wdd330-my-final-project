import { PRODUCT_API_BASE_URL } from "./constants.mjs";

export default class ExternalServices {
  constructor(baseUrl = PRODUCT_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getData(query = "") {
    const endpoint = `${this.baseUrl}${query}`;

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Unable to fetch data from Makeup API:", error);
      return [];
    }
  }

  async getNailPolishProducts(limit = 10) {
    const products = await this.getData("?product_type=nail_polish");

    return products
      .filter((product) => product.product_type === "nail_polish")
      .slice(0, limit);
  }

  async getProductById(productId) {
    if (!productId) {
      return null;
    }

    const products = await this.getNailPolishProducts(200);
    return (
      products.find((product) => String(product.id) === String(productId)) || null
    );
  }
}
