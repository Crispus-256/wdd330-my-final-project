export function filterProductsByTerm(products, term = "") {
  const normalizedTerm = term.trim().toLowerCase();

  if (!normalizedTerm) {
    return products;
  }

  return products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const brand = (product.brand || "").toLowerCase();
    return name.includes(normalizedTerm) || brand.includes(normalizedTerm);
  });
}
