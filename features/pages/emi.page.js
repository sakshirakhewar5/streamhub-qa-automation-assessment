class EmiPage {
  constructor(page) {
    this.page = page;
  }

  async open(baseUrl) {
    await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  }

  // Prefer accessible/text selectors first. The fallback selectors are intentionally
  // isolated here so application markup changes affect one page object, not steps.
  async selectLoanTab(name) {
    const candidates = [
      this.page.getByRole("link", { name, exact: true }),
      this.page.getByRole("tab", { name, exact: true }),
      this.page.getByText(name, { exact: true })
    ];
    for (const locator of candidates) {
      if (await locator.count()) {
        await locator.first().click();
        await this.page.waitForTimeout(500);
        return;
      }
    }
    throw new Error(`Unable to locate loan tab: ${name}`);
  }

  async inputs() {
    return this.page.locator("input");
  }

  async setInputNearLabel(labelText, value) {
    // Accessibility-first strategy: find text then nearest input container.
    const label = this.page.getByText(labelText, { exact: false }).first();
    if (await label.count()) {
      const container = label.locator("xpath=ancestor::*[self::div or self::li][1]");
      const input = container.locator("input").first();
      if (await input.count()) {
        await input.fill(String(value));
        await input.press("Tab");
        return;
      }
    }
    throw new Error(`Unable to locate input for ${labelText}`);
  }

  async setLoanAmount(value) {
    await this.setInputNearLabel("Home Loan Amount", value);
  }

  async setInterestRate(value) {
    await this.setInputNearLabel("Interest Rate", value);
  }

  async setTenureYears(value) {
    await this.setInputNearLabel("Loan Tenure", value);
  }

  async readEmi() {
    const text = await this.page.locator("body").innerText();
    const match = text.match(/Loan EMI\s*₹\s*([\d,]+)/);
    if (!match) throw new Error("Loan EMI value not found");
    return Number(match[1].replace(/,/g, ""));
  }

  async findChartCanvas() {
    return this.page.locator("canvas").first();
  }

  async chartValues() {
    const text = await this.page.locator("body").innerText();
    // The site renders chart data as text/accessible labels in some layouts.
    const numbers = [...text.matchAll(/₹\s*([\d,]+)/g)]
      .map(m => Number(m[1].replace(/,/g, "")))
      .filter(n => n > 0);
    return numbers.slice(0, 2);
  }

  async barCount() {
    // Canvas/SVG chart implementations vary. Count SVG rects first, then bars.
    const rects = await this.page.locator("svg rect").count();
    if (rects > 0) return rects;
    return await this.page.locator("canvas").count();
  }

  async firstTooltipValue() {
    const selectors = [
      "[role='tooltip']",
      ".tooltip",
      ".chartjs-tooltip"
    ];
    for (const selector of selectors) {
      const locator = this.page.locator(selector).first();
      if (await locator.count() && await locator.isVisible().catch(() => false)) {
        const text = await locator.innerText();
        const match = text.match(/[\d,]+(?:\.\d+)?/);
        if (match) return Number(match[0].replace(/,/g, ""));
      }
    }
    return null;
  }
}

module.exports = { EmiPage };
