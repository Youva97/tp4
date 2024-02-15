const { Type } = require("../models");

module.exports = function (app) {
  app.get("/v1/types", async function (req, res) {
    try {
      const types = await Type.findAll();
      res.json({ data: types, error: null });
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  app.get("/v1/types/:id", async function (req, res) {
    try {
      const type = await Type.findByPk(req.params.id);
      if (!type) {
        res.json({ data: null, error: "not_found" });
      } else {
        res.json({ data: type, error: null });
      }
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  app.post("/v1/types", async function (req, res) {
    try {
      const type = await Type.create(req.body);
      res.json({ data: type, error: null });
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  app.put("/v1/types/:id", async function (req, res) {
    try {
      const type = await Type.findByPk(req.params.id);
      if (!type) {
        res.json({ data: null, error: "not_found" });
      } else {
        await type.update(req.body);
        res.json({ data: type, error: null });
      }
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  app.delete("/v1/types/:id", async function (req, res) {
    try {
      const type = await Type.findByPk(req.params.id);
      if (!type) {
        res.json({ data: null, error: "not_found" });
      } else {
        await type.destroy();
        res.json({ data: type, error: null });
      }
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });
};
