# Repository guidance

Position.Size is a browser-only INR long-equity position sizing calculator. Read PRD.md for product scope and architecture.md for implementation boundaries.

- Use stable React and Vite, native HTML controls and plain CSS. Avoid UI/state libraries for this small application.
- Keep financial calculations in src/util/sizerUtil.js, independent of React. Validate input and use integer paise. Never use an iterative quantity reduction loop.
- Preserve both risk and allocation caps, whole-share flooring, zero-budget behavior and field-level accessible errors.
- Keep inputs local to the page; do not add storage, accounts or remote price feeds without a product requirement. Keep authorized Umami analytics value-free and production-only; use the portfolio website ID and /size route.
- Run npm run check before delivery. Visually inspect desktop and mobile after layout changes.
- Commit the npm lockfile with dependency changes. Node 22.12+ or a supported newer LTS is required.
- CI deploys only the tested artifact from main when VPS_DEPLOY_ENABLED is true. Never weaken SSH host verification or reuse the portfolio's web root.
- Update PRD.md / architecture.md when behavior or boundaries change.
