const { Invoice, Invoiceline, sequelize } = require("../models");
const auth = require("../middlewares/auth.middleware");

module.exports = function (app) {
  app.get("/v1/invoices", auth, async function (req, res) {
    try {
      const invoices = await Invoice.findAll({ include: ['customer'] });
      res.json({ data: invoices, error: null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/v1/invoices/:id", auth, async function (req, res) {
    const { id } = req.params;
    try {
      const invoice = await Invoice.findByPk(id, {
        include: [{ model: Invoiceline, as: "lines" }],
      });

      if (!invoice) {
        return res.status(404).json({ error: "Facture introuvable" });
      }
      res.json({ data: invoice, error: null }); // Correction ici
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/v1/invoices", auth, async function (req, res) {
    const t = await sequelize.transaction(); // Démarre une transaction
    try {
      const { invoiceData, lines } = req.body;
      const invoice = await Invoice.create(invoiceData, { transaction: t }); // Crée la facture

      if (lines && Array.isArray(lines)) {
        // Vérifie si des lignes ont été fournies
        const linesInvoiceId = lines.map((line) => ({
          // Correction ici de 'line' à 'lines'
          ...line,
          invoiceId: invoice.id, // Assigne l'ID de la facture créée à chaque ligne
        }));
        await Invoiceline.bulkCreate(linesInvoiceId, { transaction: t }); // Crée les lignes de facture
      }

      await t.commit(); // Validation de la transaction
      res.json({ data: invoice, error: null });
    } catch (error) {
      if (!t.finished) {
        await t.rollback();
      }
      return res.status(500).json({ error: error.message });
    }
  });

  app.put("/v1/invoices/:id", auth, async function (req, res) {
    const t = await sequelize.transaction(); // Démarre une transaction
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) {
        await t.rollback();
        return res.status(404).json({ error: "Facture introuvable" });
      }

      await Invoiceline.destroy({ where: { invoiceId: invoice.id }, transaction: t });

      let totalHt = 0;
      let totalTtc = 0;

      if (req.body.lines && Array.isArray(req.body.lines)) {
        const lines = req.body.lines.map((line) => ({
          ...line,
          invoiceId: id, // On s'assure que chaque ligne est liée à l'ID de la facture
        }));
        const createdLines = await Invoiceline.bulkCreate(lines, {
          transaction: t,
        }); // Utilisation de la transaction ici aussi
        createdLines.forEach((line) => {
          totalHt += line.priceHt * line.quantity;
          // Supposons que vous avez un taux de TVA fixe pour simplifier
          // Ajoutez votre logique de calcul du TTC ici
          totalTtc += line.priceHt * line.quantity * 1.2; // Exemple avec un taux de TVA de 20%
        });
      }

      await invoice.update(req.body);
      await t.commit(); // Validation de la transaction

      const updatedInvoice = await Invoice.findByPk(id, {
        include: [{ model: Invoiceline, as: "lines" }],
      });
      res.json({ data: updatedInvoice, error: null });
    } catch (error) {
      if (!t.finished('commit')) {
        await t.rollback();
      }
      return res.status(500).json({ error: error.message });
    }
  });

  app.delete("/v1/invoices/:id", auth, async function (req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Facture introuvable" });
      }
      Invoiceline.destroy({ where: { invoiceId: invoice.id}});
      await invoice.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};


