require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();

const fs = require("fs");

async function initDatabase() {
    const { sequelize } = require('./models/index.js');

    try {
        let files = fs.readdirSync(path.join(__dirname, "models"));
        let alter = false;
        let lastModificationModels;
        try {
            lastModificationModels = JSON.parse(fs.readFileSync(path.join(__dirname, "lastModificationModels.json")));
        } catch (err) {
            lastModificationModels = {};
        }
        for (let file of files) {
            if (file.endsWith(".model.js")) {
                let stats = fs.statSync(path.join(__dirname, "models", file));
                if (lastModificationModels[file] && lastModificationModels[file] < stats.mtime) {
                    alter = true;
                }
                lastModificationModels[file] = stats.mtime;
            }
        }
        fs.writeFileSync(path.join(__dirname, "lastModificationModels.json"), JSON.stringify(lastModificationModels, null, 4));
        await sequelize.sync({ alter });
        console.log("🚀 ~ initDatabase ~ alter:", alter)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

async function initMiddlewares() {
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use(express.static(path.join(__dirname, "assets")));

    let { Eta } = require("eta");
    let eta = new Eta({ views: path.join(__dirname, "views"), cache: false });
    app.use(function (req, res, next) {
        res.render = function (view, data) {
            res.send(eta.render(view, data));
        };
        next();
    });
}

function initControllers() {
    require("./controllers/website.controller.js")(app);
    require("./controllers/products.controller")(app);
}

function initServer() {
    app.listen(process.env.PORT, function () {
        console.log("listening on port " + process.env.PORT);
    });
}

async function init() {
    await initDatabase();
    await bootstrap();
    initMiddlewares();
    initControllers();
    initServer();
}
init();



async function bootstrap() {
    const { fakerFR: faker } = require("@faker-js/faker");
    const { Type, Product } = require('./models/index.js');
    // on rempli la base de données
    let types = await Type.findAll();
    if (types.length < 3) {
        for (let i = 0; i < 3; i++) {
            await Type.create({
                name: faker.commerce.productMaterial(),
            });
        }
        for (let iP = 0; iP < 20; iP++) {
            await Product.create({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price({ min: 1000, max: 10000 }),
                typeId: faker.number.int({ min: 1, max: 3 })
            });
        }
    }
}
