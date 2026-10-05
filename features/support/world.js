const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { request, chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

class CustomWorld {
  constructor() {
    this.apiBaseUrl = process.env.API_BASE_URL || "http://127.0.0.1:3000";
    this.emiBaseUrl = process.env.EMI_BASE_URL || "https://emicalculator.net/";
    this.headless = process.env.HEADLESS !== "false";
    this.api = null;
    this.browser = null;
    this.page = null;
    this.response = null;
    this.body = null;
  }

  async takeScreenshot(name) {
    if (!this.page) return;
    const dir = path.join("test-results", "screenshots");
    fs.mkdirSync(dir, { recursive: true });
    await this.page.screenshot({
      path: path.join(dir, `${Date.now()}-${name}.png`),
      fullPage: true
    });
  }
}

Before(async function () {
  this.api = await request.newContext({
    baseURL: this.apiBaseUrl,
    extraHTTPHeaders: { Accept: "application/json" }
  });
});

After(async function (scenario) {
  if (scenario.result?.status === "FAILED") {
    await this.takeScreenshot(scenario.pickle.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase());
  }
  if (this.api) await this.api.dispose();
  if (this.page) await this.page.close();
  if (this.browser) await this.browser.close();
});

setWorldConstructor(CustomWorld);
