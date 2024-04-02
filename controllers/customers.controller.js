const { Customer } = require("../models");
const auth = require("../middlewares/auth.middleware");

module.exports = function (app) {
  app.get("/v1/customers", auth, async function (req, res) {
    try {
      const customers = await Customer.findAll({ include: ["invoices"] });
      res.json({ data: customers, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/v1/customers/:id", auth, async function (req, res) {
    const customerId = req.params.id;
    try {
      if (!customerId) {
        return res.status(404).json({ error: "Client introuvable" });
      }
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ data: null, error: "User not found" });
      }
      return res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/v1/customers", auth, async function (req, res) {
    try {
      const customer = await Customer.create(req.body);

      res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route PUT pour mettre à jour un client existant
  app.put("/v1/customers/:id", auth, async function (req, res) {
    const { id } = req.params;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ error: "Client introuvable" });
      }
      await customer.update(req.body);
      res.json({ data: customer, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route DELETE pour supprimer un client existant
  app.delete("/v1/customers/:id", auth, async function (req, res) {
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
