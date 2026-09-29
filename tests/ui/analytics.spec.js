import { test, expect } from "@playwright/test";

// Serve the built app under its production hostname without contacting production.
async function productionPreview(page, tracker = "mock") {
  await page.route("https://swarajpanigrahi.in/**", async (route) => {
    const url = new URL(route.request().url());
    const response = await page.request.get(
      `http://127.0.0.1:4173${url.pathname}`,
    );
    await route.fulfill({ response });
  });
  await page.route("https://cloud.umami.is/**", async (route) => {
    if (tracker === "blocked") return route.abort();
    await route.fulfill({
      contentType: "application/javascript",
      body: `
      window.captured = [];
      window.trackerConfig = { ...document.currentScript.dataset };
      window.umami = { track(name, data) {
        const payload = window.sizeBeforeSend('event', { url: location.pathname + location.search + location.hash, referrer: 'https://example.com/path?private=secret#hash', name, data });
        window.captured.push(payload);
        return Promise.resolve();
      } };
      window.umami.track();
    `,
    });
  });
  await page.goto("https://swarajpanigrahi.in/size/?private=secret#calculator");
}

test("production analytics uses portfolio ID, normalized route and bounded value-free events", async ({
  page,
}) => {
  await productionPreview(page);
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.captured?.some((event) => event.name === "size-load"),
      ),
    )
    .toBe(true);
  const config = await page.evaluate(() => window.trackerConfig);
  expect(config.websiteId).toBe("00bb3f90-3cce-45fa-9508-6281ed65e97e");
  expect(config.excludeSearch).toBe("true");
  await page.getByLabel("Target price", { exact: true }).fill("1010");
  await page.getByLabel("Target price", { exact: true }).press("Tab");
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "1%", exact: true }).click();
  await page.getByText("The math behind your move").click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.captured.some((event) => event.name === "size-formula-open"),
      ),
    )
    .toBe(true);
  const events = await page.evaluate(() => window.captured);
  expect(events.filter((event) => event.name === "size-reset")).toHaveLength(1);
  expect(events.filter((event) => event.name === "size-engaged")).toHaveLength(
    1,
  );
  expect(events.some((event) => event.name === "size-risk-preset")).toBe(true);
  expect(events.some((event) => event.name === "size-formula-open")).toBe(true);
  expect(
    events.some(
      (event) =>
        event.name === "size-plan-evaluated" &&
        event.data.outcome === "below-minimum",
    ),
  ).toBe(true);
  for (const event of events) {
    expect(event.url).toBe("/size");
    expect(event.referrer).toBe("https://example.com/path");
    for (const key of Object.keys(event.data ?? {})) {
      expect([
        "field",
        "outcome",
        "elapsed_ms",
        "load_ms",
        "dom_ready_ms",
        "ttfb_ms",
        "fcp_ms",
      ]).toContain(key);
    }
  }
});

test("analytics is not loaded on localhost", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => {
    if (request.url().includes("umami")) requests.push(request.url());
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Reset" }).click();
  expect(await page.locator('script[src*="umami"]').count()).toBe(0);
  expect(requests).toEqual([]);
});

test("blocked analytics never breaks the calculator", async ({ page }) => {
  await productionPreview(page, "blocked");
  await page.getByLabel("Target price", { exact: true }).fill("1010");
  await expect(page.getByTestId("trade-fit")).toHaveText(
    "Does not meet your rules",
  );
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByTestId("trade-fit")).toHaveText("Meets your rules");
});
