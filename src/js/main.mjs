import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ExternalServices();
const productListElement = document.querySelector("[data-product-list]");

if (productListElement) {
  const productList = new ProductList(dataSource, productListElement);
  productList.init();
}

const headerElement = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-btn");

if (headerElement && menuButton) {
  const closeMenu = () => {
    headerElement.classList.remove("menu-open");
    document.body.classList.remove("mobile-menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = headerElement.classList.toggle("menu-open");
    document.body.classList.toggle("mobile-menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  };

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 600) {
      return;
    }

    if (!headerElement.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      closeMenu();
    }
  });
}
