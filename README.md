# Wyze Bundle Builder

A responsive React prototype for configuring a home security bundle. Products,
plans, sensors, and accessories are rendered from `src/data.json`, with a live
review panel that stays synchronized with the builder.

## Requirements

- Node.js 20 or newer
- npm

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Production build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Features

- Four-step accordion bundle builder
- Data-driven products and step types
- Product variants with independent quantities and images
- Configurable stock limits through `maxQuantity`
- Single-select monitoring plans
- Dedicated extra-protection controls
- Synchronized quantity controls in product cards and the review panel
- Live totals, discounts, shipping, and financing calculations
- Desktop, tablet, and mobile layouts
- Configuration persistence using `localStorage`

## Project structure

```text
src/
  components/
    ExtraProtectionCard.jsx
    PlanCard.jsx
    ProductCard.jsx
    ProductImage.jsx
    QuantityStepper.jsx
    ReviewItem.jsx
    ReviewPanel.jsx
    Step.jsx
  App.jsx
  data.json
  main.jsx
  style.css
```

## Implementation notes

- `src/data.json` contains catalog information such as products, prices,
  variants, images, and stock limits.
- Selected product and variant quantities are runtime state rather than catalog
  data.
- Previously saved configurations using the older quantity structure are
  migrated when restored.
- Checkout is intentionally a prototype confirmation because no checkout
  destination was provided.
- Product images fall back gracefully if an image asset is unavailable.

