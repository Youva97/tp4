const { Customer } = require("../models");

module.exports = function (app) {
  app.get("/v1/customers", async function (req, res) {
    try {
      const customers = await Customer.findAll();
      res.json({ data: customers, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/v1/customers/:id", async function (req, res) {
    const { id } = req.params;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ error: "Client introuvable" });
      }
      res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/v1/customers", async function (req, res) {
    const { name, firstname, address1, address2, zipCode, city, email, phone } =
      req.body;
    try {
      const customer = await Customer.create({
        name,
        firstname,
        address1,
        address2,
        zipCode,
        city,
        email,
        phone,
      });
      res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route PUT pour mettre à jour un client existant
  app.put("/v1/customers/:id", async function (req, res) {
    const { id } = req.params;
    const { name, firstname, address1, address2, zipCode, city, email, phone } =
      req.body;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ error: "Client introuvable" });
      }
      await customer.update({
        name,
        firstname,
        address1,
        address2,
        zipCode,
        city,
        email,
        phone,
      });
      res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route DELETE pour supprimer un client existant
  app.delete("/v1/customers/:id", async function (req, res) {
    const { id } = req.params;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ error: "Client introuvable" });
      }
      await customer.destroy();
      res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
