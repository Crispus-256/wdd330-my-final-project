# Nail Trend Scout

Nail Trend Scout helps beauty shoppers discover trending nail ideas and quickly save matching products for their next look.

## Project Concept and Value

This app is a vanilla JavaScript storefront + inspiration experience that combines trend discovery and product browsing in one place.

## Week 05 Foundation Checklist

- [x] HTML, CSS, and vanilla JavaScript only
- [x] Two third-party APIs selected
- [ ] All exposed features fully operational (in progress)
- [x] Static and dynamic markup combined
- [x] CSS animation concept defined and applied
- [x] Clean modular code with ES modules
- [x] ESLint configured
- [ ] Accessibility, valid HTML/CSS, and SEO final pass (in progress)

## Chosen APIs

1. Makeup API (products)
   - Endpoint base: `https://makeup-api.herokuapp.com/api/v1/products.json`
   - Purpose: Load nail polish product data (name, brand, price, image, details).
2. YouTube Data API v3 (trend/inspiration content)
   - Endpoint base: `https://www.googleapis.com/youtube/v3/search`
   - Purpose: Fetch trend-related nail video inspiration and links.

## User Flow

1. User lands on the home page.
2. User views trend inspiration and product cards.
3. User searches products by name/brand.
4. User opens a product detail page.
5. User adds the product to cart.
6. User reviews saved cart items on the cart page.

## Confirmed Page Structure

- Home: `src/index.html`
- Product detail: `src/product/index.html`
- Cart: `src/cart/index.html`

## Architecture and Modules

- `src/js/ExternalServices.mjs`: Makeup API data service
- `src/js/TrendServices.mjs`: YouTube trend API data service
- `src/js/ProductList.mjs`: Product list rendering and filtering
- `src/js/product-details-renderer.mjs`: Product detail UI template
- `src/js/cart-storage.mjs`: Cart state in localStorage
- `src/js/search-filter.mjs`: Product search/filter logic
- `src/js/utils.mjs`: Shared DOM and storage helpers
- `src/js/constants.mjs`: Shared constants and keys

## Homepage Section Purpose

- Hero: Project purpose and trend inspiration entry point
- Trend gallery: Dynamic trend links from external API
- Product grid: Dynamic product cards from Makeup API
- Header search: Filter products quickly by name/brand

## Branding and Visual Direction

- Theme: Premium boutique look (deep purple + gold accents)
- Typography: Montserrat for headings, Open Sans for body text
- Mood: Clean, editorial, polished, product-forward

## Responsive Behavior Plan

- Desktop: Two-column discovery layout
- Tablet: Single-column with card grid reduction
- Mobile: Compact navigation and simplified product card layout

## Reusable Animation Concept

- Hero and cards use entrance and hover motion for perceived liveliness.

## Product Detail Content Plan

- Product image
- Product name
- Brand
- Price
- Description
- External source link
- Add to Cart action

## Cart Behavior Plan

- Cart acts as a saved selection list.
- No duplicate products allowed.
- User can remove items and clear the list.

## localStorage Strategy

- Key: `nailTrendScoutCart`
- Value: JSON array of product objects (id, name, brand, image, price, links)

## Search Behavior

- Home page search filters products by name or brand.

## Trello Label Set

- Must Have
- Bug
- API
- UI
- Accessibility
- SEO
- Testing
- Stretch

## Placeholder Audit (Current)

- Home hero still uses simplified placeholder visuals
- Some trend gallery visuals are still generic
- Product details need richer formatting polish
- Cart page needs more visual styling and totals
- Search UI is functional but can be enhanced with empty-state messaging
- Some nav routes/labels can be expanded as more pages are added

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint on JS modules

## Environment Variables

- `VITE_YOUTUBE_API_KEY` - required to fetch YouTube trend results in development and production.
- Copy `.env.example` to `.env` and replace the placeholder with your real API key.
