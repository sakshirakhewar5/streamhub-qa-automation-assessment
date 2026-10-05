const express = require("express");
const products = require("./data/products.json");

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "UP", service: "streamhub-assessment-api" });
});

app.get("/api/products", (req, res) => {
  const {
    search,
    category,
    sort = "name_asc",
    page = "1",
    limit = "10"
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ error: "page must be a positive integer" });
  }
  if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 50) {
    return res.status(400).json({ error: "limit must be an integer between 1 and 50" });
  }

  const allowedSorts = new Set(["name_asc", "price_asc", "price_desc"]);
  if (!allowedSorts.has(sort)) {
    return res.status(400).json({
      error: "sort must be one of: name_asc, price_asc, price_desc"
    });
  }

  let result = [...products];

  if (search) {
    const term = String(search).toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  if (category) {
    result = result.filter(
      p => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (sort === "name_asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else {
    result.sort((a, b) => b.price - a.price);
  }

  const start = (pageNumber - 1) * limitNumber;
  const data = result.slice(start, start + limitNumber);

  res.status(200).json({
    page: pageNumber,
    limit: limitNumber,
    total: result.length,
    data
  });
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id must be an integer" });
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Streamhub assessment API running on http://127.0.0.1:${PORT}`);
});
