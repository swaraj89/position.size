# Position.Size

A modern, browser-only position sizing calculator for long equity trades in INR. Enter capital, risk, allocation, entry and stop to calculate a whole-share position constrained by both budgets.

## Develop

Use Node 22.12+ (or a newer supported LTS).

```sh
npm ci
npm run dev
```

## Validate

```sh
npx playwright install chromium
npm run check
```

`npm run check` runs ESLint, calculation tests, production build and browser smoke tests. `npm run preview` serves the production output. Deploy the contents of `dist/` to a static host; production asset URLs use `/size/`. Configure Nginx to serve the app at `/size/` and redirect `/size` to `/size/` (or serve the same index). Keep the portfolio at `/`.

## GitHub CI/CD

`.github/workflows/deploy.yml` follows the portfolio website's test/build/artifact/VPS pattern. PRs and main pushes run validation. Deployment is skipped until repository variable `VPS_DEPLOY_ENABLED` equals `true`. Then successful main pushes or manual main runs upload the tested build.

Configure these repository Actions secrets:

| Secret                | Value                                              |
| --------------------- | -------------------------------------------------- |
| `VPS_HOST`            | Hostname or IPv4 address                           |
| `VPS_USER`            | SSH deployment user                                |
| `VPS_SSH_PORT`        | Optional port, defaults to 22                      |
| `VPS_SSH_PRIVATE_KEY` | Deployment private key                             |
| `VPS_SSH_KNOWN_HOSTS` | Independently verified pinned SSH host key line(s) |
| `VPS_TARGET_DIR`      | Dedicated absolute web root for this calculator    |

Use a separate web root from the portfolio. The host needs SSH, rsync, a writable destination, and a web server configured to serve that directory. The workflow verifies uploaded file checksums; it does not provision a server, configure DNS/TLS or check public HTTP availability. Do not enable deployment until the destination is ready. No live deployment was performed as part of the source migration.

## Documentation

- [PRD](PRD.md): original behavior, scope and acceptance criteria.
- [Architecture](architecture.md): state, calculations and delivery.
- [Agent instructions](AGENTS.md): repository maintenance rules.

Calculations omit fees, taxes and slippage. Actual losses may exceed a planned stop.

### Troubleshoot deployment prerequisites

The SSH preparation step reports authentication, destination permissions and remote rsync availability separately. A bare exit code 1 from the older combined command cannot distinguish an unwritable directory from missing rsync.

- If directory creation fails, check `VPS_TARGET_DIR` and its parent-directory permissions.
- If directory access fails, have the server administrator grant `VPS_USER` write and traversal access to the calculator's dedicated web root. Do not make the directory world-writable or change ownership of the portfolio's root.
- If rsync is unavailable, install it on the VPS using its package manager and ensure it is on the deployment user's non-interactive SSH PATH. Installing it on the GitHub runner alone does not fix the remote prerequisite.
- Authentication/network failures occur before the “SSH authentication succeeded” message; inspect SSH's own error above the final exit code.

## Umami analytics at /size

Uses the existing portfolio website ID `00bb3f90-3cce-45fa-9508-6281ed65e97e` and `https://cloud.umami.is/script.js`. No new Umami website or subscription is required. Open that website's dashboard and filter **URL = /size**, or tag **position-size**, to isolate this calculator. Both /size and /size/ normalize to /size. localhost, preview hosts and development builds do not load the tracker.

| Event                                       | Meaning / properties                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Automatic pageview                          | Visits, visitors, referrers and devices for /size                       |
| `size-load`                                 | `load_ms`, `dom_ready_ms`, `ttfb_ms`; `fcp_ms` if available             |
| `size-engaged`                              | First field blur or preset click; `elapsed_ms` since navigation         |
| `size-field-used`                           | One per field name on blur; no entered value                            |
| `size-plan-evaluated`                       | One per outcome: meets-rules, below-minimum, zero-shares, invalid-input |
| `size-reset`, `size-risk-preset`            | First use of each button type                                           |
| `size-formula-open`                         | First formula disclosure open                                           |
| `size-github-click`, `size-portfolio-click` | First outbound link use                                                 |
| `size-app-error`                            | First uncaught error/rejection; no message or stack                     |

Custom events count once per action/field/outcome per page, not every click. Initial example defaults are not counted as an evaluated plan. Load is navigation-to-window-load, including the deferred tracker; first contentful paint is optional and these are not a full Core Web Vitals suite. Events arrive only when Umami loads successfully; ad blockers can prevent them. An invalid outcome can be a normal editing state, not a defect.

Useful comparisons: engaged visits vs pageviews, rule-passing vs rule-failing plan usage, field usage and formula usage. A visit may produce multiple outcomes; outcome counts are not trade counts. Review numeric event properties for timing distributions. No financial values or user IDs are sent. URL query strings and fragments are excluded.

This uses Umami's existing free-tier-compatible pageviews and custom events. The portfolio and app share its usage allowance; each event and stored property contributes to quota. No paid feature or account upgrade is enabled. Check your account's remaining quota rather than assuming unlimited free collection. See [Umami Cloud FAQ](https://docs.umami.is/docs/cloud/faq) and [tracker configuration](https://docs.umami.is/docs/tracker-configuration).

After deployment, visit /size, change an input and leave the field, then verify /size and size-* events in the existing dashboard. If Nginx sends a Content-Security-Policy, allow the Umami script host and its collector endpoint. Local tests stub tracking and do not verify delivery into your live dashboard.
