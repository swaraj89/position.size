import { test, expect } from "@playwright/test";

test("calculates, validates, changes presets, and resets without browser errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.getByTestId("quantity")).toHaveText("5");
  await page.getByLabel("Stop-loss price", { exact: true }).fill("900");
  await page.getByRole("button", { name: "1%", exact: true }).click();
  await expect(page.getByTestId("quantity")).toHaveText("1");
  await page.getByLabel("Stop-loss price", { exact: true }).fill("1000");
  await expect(page.getByTestId("quantity")).toHaveText("—");
  await expect(page.getByText("Stop loss must be below")).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByTestId("quantity")).toHaveText("5");
  await page.getByLabel("Risk per trade", { exact: true }).fill("0");
  await expect(page.getByTestId("quantity")).toHaveText("0");
  await page.getByLabel("Portfolio value", { exact: true }).fill("");
  await expect(page.getByTestId("quantity")).toHaveText("—");
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByText("The math behind your move").click();
  await expect(page.getByText("shares = floor")).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [375, 1440]) {
  test(`fits ${width}px viewport and supports keyboard navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to calculator" }),
    ).toBeFocused();
  });
}

test("trade fit responds to target, minimum ratio, invalid values and reset", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.getByTestId("trade-fit")).toHaveText("Meets your rules");
  await expect(page.getByTestId("profit")).toHaveText("₹100.00");
  await page.getByLabel("Target price", { exact: true }).fill("1010");
  await expect(page.getByTestId("trade-fit")).toHaveText(
    "Does not meet your rules",
  );
  await expect(page.getByTestId("quantity")).toHaveText("5");
  await page.getByLabel("Minimum reward / risk", { exact: true }).fill("1");
  await expect(page.getByTestId("trade-fit")).toHaveText("Meets your rules");
  await page.getByLabel("Target price", { exact: true }).fill("1000");
  await expect(page.getByTestId("profit")).toHaveText("—");
  await expect(page.getByTestId("trade-fit")).toHaveText("Check your inputs");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByLabel("Target price", { exact: true })).toHaveValue(
    "1020",
  );
  await expect(
    page.getByLabel("Minimum reward / risk", { exact: true }),
  ).toHaveValue("2");
  await page.getByLabel("Risk per trade", { exact: true }).fill("0");
  await expect(page.getByTestId("trade-fit")).toHaveText(
    "Does not meet your rules",
  );
});

test("keyboard-only trade entry replaces values, advances fields and reviews the result", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.getByLabel("Entry price", { exact: true })).toBeVisible();
  await page.keyboard.press("Alt+4");
  await expect(page.getByLabel("Entry price", { exact: true })).toBeFocused();
  await page.keyboard.type("200");
  await expect(page.getByLabel("Entry price", { exact: true })).toHaveValue(
    "200",
  );
  await page.keyboard.press("Enter");
  await expect(
    page.getByLabel("Stop-loss price", { exact: true }),
  ).toBeFocused();
  await page.keyboard.type("190");
  await page.keyboard.press("Enter");
  await page.keyboard.type("230");
  await page.keyboard.press("Enter");
  await page.keyboard.type("2");
  await page.keyboard.press("Shift+Enter");
  await expect(page.getByLabel("Target price", { exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("region", { name: "Trade-fit summary", exact: true }),
  ).toBeFocused();
  await expect(page.getByTestId("trade-fit")).toHaveText("Meets your rules");
  await expect(page.getByTestId("quantity")).toHaveText("25");
  await page.keyboard.press("Alt+Shift+R");
  await expect(page.getByLabel("Entry price", { exact: true })).toHaveValue(
    "1000",
  );
  await expect(page.getByLabel("Entry price", { exact: true })).toBeFocused();
});

test("all field shortcuts, help and escape work without overriding ordinary typing or tab", async ({
  page,
}) => {
  await page.goto("./");
  await expect(
    page.getByLabel("Portfolio value", { exact: true }),
  ).toBeVisible();
  const labels = [
    "Portfolio value",
    "Max. allocation",
    "Risk per trade",
    "Entry price",
    "Stop-loss price",
    "Target price",
    "Minimum reward / risk",
  ];
  for (const [index, label] of labels.entries()) {
    await page.keyboard.press(`Alt+${index + 1}`);
    await expect(page.getByLabel(label, { exact: true })).toBeFocused();
  }
  await page.keyboard.press("?");
  await expect(page.locator(".shortcut-help")).not.toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await page.keyboard.press("?");
  await expect(page.locator(".shortcut-help")).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(page.locator(".shortcut-help")).not.toHaveAttribute("open", "");
  await page.keyboard.press("Alt+4");
  await page.keyboard.press("Tab");
  await expect(
    page.getByLabel("Stop-loss price", { exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByLabel("Entry price", { exact: true })).toBeFocused();
});
