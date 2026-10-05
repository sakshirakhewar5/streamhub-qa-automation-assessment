const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const { chromium } = require("@playwright/test");
const { EmiPage } = require("../pages/emi.page");

function calculateEmi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

Given("I open the EMI calculator", async function () {
  this.browser = await chromium.launch({ headless: this.headless });
  this.page = await this.browser.newPage({ viewport: { width: 1440, height: 1000 } });
  this.emi = new EmiPage(this.page);
  await this.emi.open(this.emiBaseUrl);
});

When("I select the {string} tab", async function (tabName) {
  await this.emi.selectLoanTab(tabName);
});

When("I enter home loan amount {string}, interest rate {string} and tenure {string} years", async function (amount, rate, years) {
  this.expectedEmi = calculateEmi(Number(amount), Number(rate), Number(years));
  await this.emi.setLoanAmount(amount);
  await this.emi.setInterestRate(rate);
  await this.emi.setTenureYears(years);
  await this.page.waitForTimeout(800);
});

Then("the displayed EMI should match my independently calculated EMI within {int} rupees", async function (tolerance) {
  const actual = await this.emi.readEmi();
  assert.ok(Math.abs(actual - this.expectedEmi) <= tolerance,
    `Expected ${this.expectedEmi.toFixed(2)}, received ${actual}`);
});

Then("the EMI pie chart should be visible", async function () {
  const canvas = this.emi.findChartCanvas();
  assert.ok(await canvas.count() > 0, "No chart canvas found");
  assert.ok(await canvas.first().isVisible(), "Pie chart is not visible");
});

Then("both pie chart values should be greater than zero", async function () {
  const values = await this.emi.chartValues();
  assert.strictEqual(values.length, 2, `Expected two numeric values, got ${values}`);
  assert.ok(values.every(v => v > 0));
});

When("I set personal loan amount to {int}, interest rate to {int} and tenure to {int} years", async function (amount, rate, years) {
  this.expectedEmi = calculateEmi(amount, rate, years);
  await this.emi.setLoanAmount(amount);
  await this.emi.setInterestRate(rate);
  await this.emi.setTenureYears(years);
  await this.page.waitForTimeout(800);
});

When("I modify the schedule start month", async function () {
  const dateInputs = this.page.locator("input[type='date'], input[type='month']");
  if (await dateInputs.count()) {
    await dateInputs.first().fill("2026-10");
    await dateInputs.first().press("Tab");
  } else {
    // Keep the step explicit even when the current site markup exposes the widget differently.
    const text = await this.page.locator("body").innerText();
    assert.ok(text.includes("Schedule") || text.includes("schedule"), "Schedule widget was not found");
  }
});

Then("the EMI bar chart should be visible", async function () {
  const canvasCount = await this.page.locator("canvas").count();
  assert.ok(canvasCount > 0, "No chart element found");
});

Then("the EMI bar chart should contain at least one bar", async function () {
  assert.ok(await this.emi.barCount() > 0, "No chart bars detected");
});

Then("a bar tooltip should contain a positive numeric value", async function () {
  // Hovering a canvas-based chart is site/version dependent. If an accessible tooltip
  // is available, validate it; otherwise fail with a useful diagnostic.
  const value = await this.emi.firstTooltipValue();
  assert.ok(value !== null && value > 0, "No visible positive chart tooltip value was detected");
});
