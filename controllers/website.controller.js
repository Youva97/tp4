const { Product, Type } = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index.eta", { menu: "index" });
    });

    app.get("/qui-sommes-nous", function (req, res) {
        res.render("whoweare.eta", { menu: "qui-sommes-nous" });
    });

    app.get("/nos-produits", async function (req, res) {
        let types = await Type.findAll({ order: [["name", "ASC"]], include: ["products"] });
        let where = {};
        if (req.query.type) where.typeId = req.query.type;
        let products = await Product.findAll({
            where,
            order: [["name", "ASC"]],
            include: ["type"]
        });

        res.render("products.eta", { products, types, menu: "nos-produits" })
    })

    app.get("/nos-produits/:id", async function (req, res) {
        let product = await Product.findOne({
            where: { id: req.params.id },
            include: ["type"]
        });
        if (!product) res.redirect("/nos-produits")
        res.render("product-details.eta", { product, menu: "nos-produits" });
    });
}
