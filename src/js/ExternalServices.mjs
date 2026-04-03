export default class ExternalServices {
  constructor(baseUrl = "https://makeup-api.herokuapp.com/api/v1/products.json") {
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
}
