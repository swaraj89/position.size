# Position.Size — product requirements

## Purpose

Help an individual trader determine the maximum whole-share quantity for a long equity trade, constrained by both a portfolio risk budget and a capital allocation cap. All amounts use INR. The calculator runs locally in the browser without accounts or market-data services.

## Existing application review

The original React 17 / Parcel / Material UI application accepts portfolio capital, maximum allocation percentage, equity risk percentage, entry price (CMP), and stop-loss price. It displays capital, allocation, risk budget, quantity and cost. Defaults are ₹10,000, 50%, 2.5%, ₹1,000 and ₹990 respectively.

The existing quantity reduction loop is unsafe: its adjustment effectively floors the stop distance, so gaps below ₹1 may never reduce quantity, while larger gaps can overshoot. Equal entry/stop values cause division by zero. Truthiness checks discard zero inputs. Placeholder help text, duplicate input IDs and a slider-only capital field reduce usability. There are no executable tests or CI workflows.

## Modernization scope

- React's latest stable npm release and Vite; remove Parcel, Material UI, Emotion and obsolete hooks/tooling.
- Responsive, accessible single-screen calculator with precise numeric entry, optional percentage sliders and immediate results.
- A restrained charcoal and lime visual language, inspired by the portfolio's typography, thin rules and accent color.
- Preserve all five inputs and original defaults. Add convenient risk presets and an explicit reset.
- Prominent whole-share quantity, position value, estimated stop loss, remaining capital, stop distance, allocation usage and explanation of the binding constraint.
- Explain the formula in an expandable section. No invented live prices, return forecasts or signals.
- GitHub Actions validation and optional VPS delivery modeled on the portfolio workflow.

## Calculation contract

Budget = capital × risk percentage / 100. Allocation cap = capital × allocation percentage / 100.
Risk per share = entry − stop. Quantity = floor(min(budget / risk per share, allocation cap / entry)).
Position value = quantity × entry. Estimated loss = quantity × risk per share.
Amounts accept at most two decimal places and are represented as integer paise. Percentage budgets are floored to paise so they never exceed the entered limits. Fractional shares, leverage, short positions, brokerage, taxes, slippage and derivatives are outside scope.

## Input and empty states

Capital and entry must be positive; stop can be zero but must be below entry. Percentages are between 0 and 100. Empty, negative, non-finite, over-precision and unsafe-large inputs produce field-level explanations and hide computed results. Zero risk or allocation is valid and yields zero shares. An unaffordable trade shows zero with a helpful explanation. Editing must never freeze the page or leave stale results visible.

## Acceptance criteria

1. Original defaults return 5 shares, ₹5,000 value and ₹50 estimated loss.
2. Quantity never breaches either budget; one additional share would breach at least one budget.
3. Decimal stop gaps, equal/reversed prices, blank inputs and zero limits are covered by automated checks.
4. Every input has a unique accessible label and associated error. All controls work by keyboard; results updates are announced politely.
5. Layout works at 375px and desktop widths without horizontal overflow.
6. Clean installation, lint, calculation tests, UI smoke tests and production build pass.
7. Pull requests validate only; main pushes/manual main runs may deploy the validated artifact only when explicitly enabled in repository configuration.

## Delivery boundary

Source and CI/CD configuration are deliverables. Publishing requires a dedicated VPS directory and the repository's deployment secrets/enablement. No production infrastructure or DNS changes are implied by this modernization.
