import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/ui",
  use: { baseURL: "http://127.0.0.1:4173/size/", browserName: "chromium" },
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://127.0.0.1:4173/size/",
    reuseExistingServer: !process.env.CI,
  },
});
