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

`npm run check` runs ESLint, calculation tests, production build and browser smoke tests. `npm run preview` serves the production output. Deploy the contents of `dist/` to a static host; assets use relative URLs.

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
