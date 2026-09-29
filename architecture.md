# Architecture

## Runtime

A static React 19 application built with Vite 8. No server, router, data fetching, global state library or component framework is necessary. Plain CSS uses the portfolio's charcoal/acid-lime palette and thin rules. System fonts avoid external requests. The page is a long-equity INR calculator, with no persisted personal inputs.

## File responsibilities

- `index.html`: document metadata and root mount.
- `src/main.jsx`: React createRoot and StrictMode bootstrap.
- `src/App.jsx`: five controlled string inputs, accessible fields, presets/reset, derived results and formula disclosure. One state object allows blank inputs during editing; results are calculated synchronously rather than copied into state through effects.
- `src/util/sizerUtil.js`: defaults, decimal validation and pure calculation. Prices are parsed into integer paise; percentage multiplication uses BigInt to avoid overflow. Return `{ errors, result }`, with a null result on invalid input. Values are capped at ₹10 billion and two decimals. Runtime cost is constant.
- `src/style.css`: responsive two-column layout, single-column mobile layout, focus and reduced-motion styles.
- `tests/sizer.test.js`: Node built-in test runner for budget limits, flooring, precision, malformed inputs and historical regression cases.
- `tests/ui`: Playwright smoke tests against the production preview, covering interactions, invalid states, reset, keyboard focus and mobile overflow.

## Data flow

Input event → update a string field → validate all fields → calculate capped whole-share quantity → render a fresh result or field errors. No effects, asynchronous calculations or loops are involved. Money is formatted with Intl.NumberFormat for en-IN.

## Build and delivery

Node 22.12+ is required (CI uses Node 22). `npm ci` installs the committed lockfile. Vite emits `dist/`, with relative asset URLs for static root/subdirectory hosting. GitHub Actions runs lint, calculation tests, production build and Chromium UI tests. Only that successful build artifact is eligible for the deploy job.

The workflow is adapted from `swarajpanigrahi.in/.github/workflows`: main push/manual main only, `VPS_DEPLOY_ENABLED=true`, validated secret configuration, pinned SSH host keys, rsync upload and checksum verification. PRs never deploy. Remote files are not deleted, preserving old hashed assets for cached documents. Upload is not an atomic release switch; use versioned releases if uninterrupted multi-file rollout becomes necessary. Serving TLS, DNS, caching and old asset cleanup belong to the host configuration. No public HTTP health check is implied by file verification.

## Deliberate boundaries

No short selling, leverage, fractional shares, target returns, brokerage or live prices. A stop is an estimate, not a guaranteed execution price. No backend or account/analytics surface. AGENTS.md holds maintenance instructions; PRD.md defines acceptance criteria.
