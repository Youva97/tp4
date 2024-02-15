const { User } = require("../models");
const uuid = require("uuid");

module.exports = function (app) {
  // récupérer un utilisateur
  app.get("/v1/users", async function (req, res) {
    try {
      const users = await User.findAll();
      res.json({ data: users, error: null });
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  // récupérer un utilisateur par son ID
  app.get("/v1/users/:id", async function (req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        res.json({ data: null, error: "not_found" });
      } else {
        res.json({ data: user, error: null });
      }
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  // créer un nouvel utilisateur
  app.post("/v1/users", async function (req, res) {
    try {
      const user = await User.create(req.body);
      res.json({ data: user, error: null });
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  // mise à jour un utilisateur existant
  app.put("/v1/users/:id", async function (req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        res.json({ data: null, error: "not_found" });
      } else {
        await user.update(req.body);
        res.json({ data: user, error: null });
      }
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  // supprimer un utilisateur
  app.delete("/v1/users/:id", async function (req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        res.json({ data: null, error: "not_found" });
      } else {
        await user.destroy();
        res.json({ data: user, error: null });
      }
    } catch (error) {
      res.json({ data: null, error: error.message });
    }
  });

  app.post("/v1/signin", async function (req, res) {
    const { login, password } = req.body;

    try {
      let user = await User.findOne({ where: { login } });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      if (password !== user.password) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }

      if (!user.token) {
        const token = uuid.v4();

        await user.update({ token });
      }

      res.json({ user, token: user.token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
