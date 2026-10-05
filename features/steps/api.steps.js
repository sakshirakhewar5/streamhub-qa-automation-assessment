const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");

Given("the assessment API is available", async function () {
  const response = await this.api.get("/api/health");
  assert.strictEqual(response.status(), 200);
});

When("I request the health endpoint", async function () {
  this.response = await this.api.get("/api/health");
  this.body = await this.response.json();
});

When("I request products with category {string}, sort {string}, page {int} and limit {int}", async function (category, sort, page, limit) {
  this.response = await this.api.get("/api/products", {
    params: { category, sort, page, limit }
  });
  this.body = await this.response.json();
});

When("I search products for {string}", async function (search) {
  this.searchTerm = search;
  this.response = await this.api.get("/api/products", { params: { search } });
  this.body = await this.response.json();
});

When("I request product id {int}", async function (id) {
  this.response = await this.api.get(`/api/products/${id}`);
  this.body = await this.response.json();
});

When("I request products with page {int}", async function (page) {
  this.response = await this.api.get("/api/products", { params: { page } });
  this.body = await this.response.json();
});

When("I request products with sort {string}", async function (sort) {
  this.response = await this.api.get("/api/products", { params: { sort } });
  this.body = await this.response.json();
});

Then("the response status should be {int}", function (expected) {
  assert.strictEqual(this.response.status(), expected);
});

Then("the response field {string} should be {string}", function (field, expected) {
  assert.strictEqual(this.body[field], expected);
});

Then("the response should contain {int} products", function (count) {
  assert.strictEqual(this.body.data.length, count);
});

Then("the response products should be sorted by ascending price", function () {
  const prices = this.body.data.map(p => p.price);
  assert.deepStrictEqual(prices, [...prices].sort((a, b) => a - b));
});

Then("every returned product should match the search term", function () {
  const term = this.searchTerm.toLowerCase();
  assert.ok(this.body.data.every(p =>
    p.name.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term)
  ));
});

Then("the product id should be {int}", function (id) {
  assert.strictEqual(this.body.id, id);
});

Then("the response should contain an error message", function () {
  assert.ok(typeof this.body.error === "string" && this.body.error.length > 0);
});
