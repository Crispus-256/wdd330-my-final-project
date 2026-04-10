import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import TrendServices from "./TrendServices.mjs";
import { DEFAULT_TREND_QUERY, VALUE_PROPOSITION } from "./constants.mjs";
import { filterProductsByTerm } from "./search-filter.mjs";
import { getCartItems } from "./cart-storage.mjs";

const dataSource = new ExternalServices();
const productListElement = document.querySelector("[data-product-list]");
const trendServices = new TrendServices();
const trendListElement = document.querySelector("[data-trend-list]");
const videoHeroElement = document.querySelector("[data-video-hero]");
const searchInput = document.querySelector(".header-search");
const searchButton = document.querySelector(".search-btn");
const featureTrendButtons = document.querySelectorAll("[data-trend-query]");
const valuePropElement = document.querySelector("[data-value-prop]");
const apiWarningElement = document.querySelector("[data-api-warning]");
const apiStatusElement = document.querySelector("[data-api-status]");
const cartBadge = document.querySelector(".cart-badge");
const hasYoutubeKey = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY);
const trendFallbackImage = "/images/hero-placeholder.svg";

// Update cart count badge
function updateCartBadge() {
  if (!cartBadge) return;
  const items = getCartItems();
  const count = items.length;
  if (count > 0) {
    cartBadge.textContent = count;
    cartBadge.hidden = false;
  } else {
    cartBadge.hidden = true;
  }
}

// Update badge on page load and when storage changes
window.addEventListener("storage", updateCartBadge);
updateCartBadge();

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
      <img src="${trend.thumbnail || trendFallbackImage}" alt="${trend.title}" loading="lazy" onerror="this.onerror=null;this.src='${trendFallbackImage}'" />
      <h3>${trend.title}</h3>
      <p>${trend.description}</p>
      <a href="${trend.link}" target="_blank" rel="noreferrer">Watch on YouTube</a>
    </article>
  `;
}

function trendHeroTemplate(trend) {
  if (!trend?.id) {
    return `
      <div class="video-hero__fallback">
        <img src="${trendFallbackImage}" alt="Nail trend placeholder" loading="lazy" />
        <p class="video-hero__fallback-text">Trend Hero Gallery — YouTube API</p>
      </div>
    `;
  }

  return `
    <iframe
      class="video-hero__iframe"
      src="https://www.youtube.com/embed/${trend.id}"
      title="${trend.title}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  `;
}

function getTrendUnavailableMessage() {
  switch (trendServices.lastFailureReason) {
    case "quotaExceeded":
      return "YouTube trends are temporarily unavailable because the API daily quota has been reached. Try again after quota reset.";
    case "missingKey":
      return "YouTube trends are disabled. Add VITE_YOUTUBE_API_KEY in your environment to enable the trend feed.";
    case "network":
      return "Trend feed is unavailable due to a network issue. Check your internet connection and try again.";
    default:
      return "Trend feed is unavailable right now. Please try again in a moment.";
  }
}

async function initTrendGallery(query = DEFAULT_TREND_QUERY) {
  if (!trendListElement) {
    return;
  }

  // Show loading state
  trendListElement.innerHTML = '<div class="loading-spinner" aria-label="Loading trends"></div>';

  const trends = await trendServices.getTrendArticles(query, 4);

  if (!trends.length) {
    if (videoHeroElement) {
      videoHeroElement.innerHTML = trendHeroTemplate(null);
    }

    const unavailableMessage = getTrendUnavailableMessage();
    trendListElement.innerHTML = `<p class='gallery-empty'>${unavailableMessage}</p>`;

    if (apiWarningElement && trendServices.lastFailureReason === "quotaExceeded") {
      apiWarningElement.hidden = false;
      apiWarningElement.textContent =
        "YouTube API quota reached for today. Trend previews will use placeholders until quota resets.";
      if (apiStatusElement) {
        apiStatusElement.hidden = true;
      }
    }

    return;
  }

  if (videoHeroElement) {
    videoHeroElement.innerHTML = trendHeroTemplate(trends[0]);
  }

  trendListElement.innerHTML = trends.map((trend) => trendCardTemplate(trend)).join("");
}

async function initFeatureTrendCards() {
  if (!featureTrendButtons.length) {
    return;
  }

  const fallbackBackground = `linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.32)), url(${trendFallbackImage})`;

  featureTrendButtons.forEach((button) => {
    button.style.backgroundImage = fallbackBackground;
    button.classList.add("feature-box--thumbnail");
  });

  if (!hasYoutubeKey) {
    return;
  }

  const previewRequests = Array.from(featureTrendButtons).map((button) => {
    const query = button.dataset.trendQuery || DEFAULT_TREND_QUERY;
    return trendServices.getTrendArticles(query, 1);
  });

  const previews = await Promise.all(previewRequests);

  previews.forEach(async (items, index) => {
    const button = featureTrendButtons[index];

    if (!button) {
      return;
    }

    const candidateThumbnails = items.map((item) => item.thumbnail).filter(Boolean);

    const resolveValidThumbnail = async () => {
      for (const url of candidateThumbnails) {
        const isValid = await new Promise((resolve) => {
          const previewImage = new Image();
          previewImage.onload = () => resolve(true);
          previewImage.onerror = () => resolve(false);
          previewImage.src = url;
        });
        if (isValid) {
          return url;
        }
      }
      return "";
    };

    const validThumbnail = await resolveValidThumbnail();
    button.style.backgroundImage = validThumbnail
      ? `linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.32)), url(${validThumbnail})`
      : fallbackBackground;
    button.classList.add("feature-box--thumbnail");
  });
}

if (productListElement) {
  const productList = new ProductList(dataSource, productListElement);
  
  // Show loading state while fetching
  productListElement.innerHTML = '<div class="loading-spinner" aria-label="Loading products"></div>';
  
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

  featureTrendButtons.forEach((button) => {
    button.addEventListener("click", () => {
      initTrendGallery(button.dataset.trendQuery || DEFAULT_TREND_QUERY);
    });
  });
}

initTrendGallery();
initFeatureTrendCards();

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
