const { Product, Type } = require("../models");

module.exports = function (app) {
  app.get("/v1/products", async function (req, res) {
    const products = await Product.findAll({ include: ["type"] });
    res.json({ data: products, error: null });
  });

  app.get("/v1/products/:id", async function (req, res) {
    const product = await Product.findByPk(req.params.id, {
      include: ["type"],
    });
    if (!product) return res.json({ error: "not_found" });
    res.json({ data: product });
  });

  app.post("/v1/products", async function (req, res) {
    const product = await Product.create(req.body);
    if (!product) return res.json({ error: "not_created" });
    res.json({ data: product });
  });

  app.put("/v1/products/:id", async function (req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.json({ error: "not_found" });
    await product.update(req.body);
    res.json({ data: product, error });
  });

  app.delete("/v1/products/:id", async function (req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.json({ error: "not_found" });
    await product.destroy();
    res.json({ data: product, error });
  });
};
