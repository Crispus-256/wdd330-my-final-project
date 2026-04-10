import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import TrendServices from "./TrendServices.mjs";
import { DEFAULT_TREND_QUERY, VALUE_PROPOSITION } from "./constants.mjs";
import { filterProductsByTerm } from "./search-filter.mjs";

const dataSource = new ExternalServices();
const productListElement = document.querySelector("[data-product-list]");
const trendServices = new TrendServices();
const trendListElement = document.querySelector("[data-trend-list]");
const searchInput = document.querySelector(".header-search");
const searchButton = document.querySelector(".search-btn");
const valuePropElement = document.querySelector("[data-value-prop]");
const apiWarningElement = document.querySelector("[data-api-warning]");
const apiStatusElement = document.querySelector("[data-api-status]");
const hasYoutubeKey = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY);

if (apiWarningElement && !hasYoutubeKey) {
  apiWarningElement.hidden = false;
  apiWarningElement.textContent =
    "YouTube trends are disabled. Add VITE_YOUTUBE_API_KEY in your environment to enable the trend feed.";
}

if (apiStatusElement && hasYoutubeKey) {
  apiStatusElement.hidden = false;
  apiStatusElement.textContent = "YouTube API key detected. Trend feed is enabled.";
}

if (valuePropElement) {
  valuePropElement.textContent = VALUE_PROPOSITION;
}

function trendCardTemplate(trend) {
  return `
    <article class="trend-card">
      ${
        trend.thumbnail
          ? `<img src="${trend.thumbnail}" alt="${trend.title}" loading="lazy" />`
          : ""
      }
      <h3>${trend.title}</h3>
      <p>${trend.description}</p>
      <a href="${trend.link}" target="_blank" rel="noreferrer">Watch on YouTube</a>
    </article>
  `;
}

async function initTrendGallery() {
  if (!trendListElement) {
    return;
  }

  const trends = await trendServices.getTrendArticles(DEFAULT_TREND_QUERY, 4);

  if (!trends.length) {
    trendListElement.innerHTML =
      "<p class='trend-gallery__status'>Trend feed is unavailable. Add VITE_YOUTUBE_API_KEY to enable YouTube trends.</p>";
    return;
  }

  trendListElement.innerHTML = trends.map((trend) => trendCardTemplate(trend)).join("");
}

if (productListElement) {
  const productList = new ProductList(dataSource, productListElement);
  productList.init();

  const runSearch = () => {
    if (!searchInput) {
      return;
    }

    const filteredProducts = filterProductsByTerm(
      productList.getProducts(),
      searchInput.value
    );
    productList.render(filteredProducts);
  };

  if (searchButton) {
    searchButton.addEventListener("click", runSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("input", runSearch);
  }
}

initTrendGallery();

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
