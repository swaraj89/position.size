# Architecture

## Runtime

A static React 19 application built with Vite 8. No server, router, data fetching, global state library or component framework is necessary. Plain CSS uses the portfolio's charcoal/acid-lime palette and thin rules. System fonts avoid external requests. The page is a long-equity INR calculator, with no persisted personal inputs.

## File responsibilities

- `index.html`: document metadata and root mount.
- `src/main.jsx`: React createRoot and StrictMode bootstrap.
- `src/App.jsx`: seven controlled string inputs, accessible fields, presets/reset, derived results and formula disclosure. One state object allows blank inputs during editing; results are calculated synchronously rather than copied into state through effects.
- `src/util/sizerUtil.js`: defaults, decimal validation and pure calculation. Prices are parsed into integer paise; percentage multiplication uses BigInt to avoid overflow. Return `{ errors, result }`, with a null result on invalid input. Values are capped at ₹10 billion and two decimals. Runtime cost is constant.
- `src/style.css`: responsive two-column layout, single-column mobile layout, focus and reduced-motion styles.
- `tests/sizer.test.js`: Node built-in test runner for budget limits, flooring, precision, malformed inputs and historical regression cases.
- `tests/ui`: Playwright smoke tests against the production preview, covering interactions, invalid states, reset, keyboard focus and mobile overflow.

## Data flow

Input event → update a string field → validate all fields → calculate capped whole-share quantity → render a fresh result or field errors. No effects, asynchronous calculations or loops are involved. Money is formatted with Intl.NumberFormat for en-IN.

## Build and delivery

Node 22.12+ is required (CI uses Node 22). `npm ci` installs the committed lockfile. Vite emits `dist/`, with absolute `/size/` asset URLs for the Nginx subdirectory deployment. Development continues to use `/`. GitHub Actions runs lint, calculation tests, production build and Chromium UI tests. Only that successful build artifact is eligible for the deploy job.

The workflow is adapted from `swarajpanigrahi.in/.github/workflows`: main push/manual main only, `VPS_DEPLOY_ENABLED=true`, validated secret configuration, pinned SSH host keys, rsync upload and checksum verification. PRs never deploy. Remote files are not deleted, preserving old hashed assets for cached documents. Upload is not an atomic release switch; use versioned releases if uninterrupted multi-file rollout becomes necessary. Serving TLS, DNS, caching and old asset cleanup belong to the host configuration. No public HTTP health check is implied by file verification.

## Deliberate boundaries

No short selling, leverage, fractional shares, brokerage or live prices. A stop is an estimate, not a guaranteed execution price. No backend or accounts. Analytics uses the existing portfolio Umami website. AGENTS.md holds maintenance instructions; PRD.md defines acceptance criteria.

## Personal trade-fit rules

Target price and minimum reward/risk are local string inputs (defaults ₹1,020 and 2×, illustrative only). Target must exceed entry and the minimum ratio must be positive. Potential profit uses integer paise; projected profits exceeding the safe integer range are rejected with a target error. Reward/risk thresholds use exact BigInt cross-multiplication before presentation rounding. Fit requires a positive quantity and the reward/risk threshold; sizing already enforces both budgets. Invalid input clears all derived results. No persistence or backend is added.

## Analytics

`src/analytics.js` loads the portfolio's Umami Cloud script and website ID only in production on swarajpanigrahi.in (or www) at /size or /size/. Initialization occurs outside React StrictMode. Umami supplies automatic pageviews; a before-send hook groups event URLs as /size and strips query/fragment data from referrers. No manual duplicate pageview is sent. Tracking failures are isolated; queued events are bounded while the script loads.

Custom size-* events measure load timings, first engagement, fields used on blur, plan outcome categories, button/link usage, formula expansion and an anonymous error occurrence. They contain no financial inputs, amounts, exception messages or user identifiers. Each action, field and outcome is counted at most once per document. This measures usage reach rather than raw repeated click totals. No extra dependency, replay, paid integration or backend is added. Tests simulate the production origin and stub Umami so CI never sends analytics.

## Keyboard interaction

App owns one cleaned-up keydown listener and an explicit input order. DOM focus/select targets existing labeled inputs; Enter navigation works independently of intermediate validation, since editing entry can temporarily invalidate stop/target. The summary is programmatically focusable, outside the regular tab sequence. The shortcut guide uses native details/summary. No hotkey dependency or persistence. Existing blur analytics also cover keyboard navigation without collecting keystrokes or values.
