require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");

async function initDatabase() {
  const { sequelize, Invoice } = require("./models/index.js");

  try {
    let files = fs.readdirSync(path.join(__dirname, "models"));
    let alter = false;
    let lastModificationModels;
    try {
      lastModificationModels = JSON.parse(
        fs.readFileSync(path.join(__dirname, "lastModificationModels.json"))
      );
    } catch (err) {
      lastModificationModels = {};
    }
    for (let file of files) {
      if (file.endsWith(".model.js")) {
        let stats = fs.statSync(path.join(__dirname, "models", file));
        if (
          lastModificationModels[file] &&
          lastModificationModels[file] < stats.mtime
        ) {
          alter = true;
        }
        lastModificationModels[file] = stats.mtime;
      }
    }
    fs.writeFileSync(
      path.join(__dirname, "lastModificationModels.json"),
      JSON.stringify(lastModificationModels, null, 4)
    );
    await sequelize.sync({ alter: true });
    //console.log("🚀 ~ initDatabase ~ alter:", alter);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

async function initMiddlewares() {
  app.use(cors());

  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

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
  require("./controllers/types.controller")(app);
  require("./controllers/users.controller.js")(app);
  require("./controllers/customers.controller")(app);
  require("./controllers/invoices.controller")(app);
}
console.log(process.env.PORT);
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
  const {
    Type,
    Product,
    User,
    Customer,
    Invoice,
    Invoiceline,
  } = require("./models/index.js");
  let roles = ["admin", "user", "guest"];
  let resources = [
    "invoices_list",
    "invoices_write",
    "products_list",
    "products_write",
    "types_list",
    "types_write",
    "customers_list",
    "customers_write",
    "users_list",
    "users_write",
  ];
  const {
    AclResource,
    AclRole,
    AclRoleResource,
  } = require("./models/index.js");

  // on rempli la base de données
  let types = await Type.findAll();
  let users = await User.findAll();
  let customers = await Customer.findAll();
  let products = await Product.findAll();
  let invoices = await Invoice.findAll();
  let invoicelines = await Invoiceline.findAll();
  let aclRoles = await AclRole.findAll();
  if (aclRoles.length == 0) {
    // écrire une boucle pour insérer les roles
    for (let role of roles) {
      await AclRole.create({ role: role });
    }
  }
  let aclResources = await AclResource.findAll();
  if (aclResources.length == 0) {
    // écrire une boucle pour insérer les resources
    for (let resource of resources) {
      await AclResource.create({ resource: resource });
    }
  }
  // on crée les relations que pour l'utilisateur "admin" où on met tout à true
  let aclRoleResources = await AclRoleResource.findAll();
  if (aclRoleResources.length === 0) {
    for (let resource of resources) {
      await AclRoleResource.create({ role: "admin", resource: resource });
    }
  }
  if (types.length < 3) {
    for (let i = 0; i < 3; i++) {
      await Type.create({
        name: faker.commerce.productMaterial(),
      });
    }
  }
  if (products.length < 20) {
    for (let iP = 0; iP < 20; iP++) {
      await Product.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        priceHt: faker.commerce.price({ min: 1000, max: 10000 }),
        typeId: faker.number.int({ min: 1, max: 3 }),
      });
    }
  }
  if (users.length < 4) {
    for (let iP = 0; iP < 4; iP++) {
      await User.create({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        login: faker.internet.userName(),
        password: faker.internet.password(),
      });
    }
  }

  if (customers.length < 20) {
    for (let iP = 0; iP < 20; iP++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomUserIndex]; // Ceci devrait maintenant toujours être défini

      if (randomUser) {
        // Vérifie si randomUser n'est pas undefined
        await Customer.create({
          firstname: faker.person.firstName(),
          name: faker.person.lastName(),
          address1: faker.location.streetAddress(),
          address2: faker.location.secondaryAddress(),
          zipCode: faker.location.zipCode(),
          city: faker.location.city(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          userId: randomUser.id,
        });
      }
    }
  }
  if (invoices.length < 20) {
    for (let l = 0; l < 20; l++) {
      // Assurez-vous d'avoir des clients avant de continuer
      if (customers.length > 0) {
        const randomCustomerId = Math.floor(Math.random() * customers.length);
        const randomCustomer = customers[randomCustomerId]; // Ceci devrait être l'objet client
        const randomPrice = faker.commerce.price(); // Génère un prix aléatoire

        await Invoice.create({
          date: faker.date.past(), // Utilise faker pour générer une date passée aléatoire
          customerId: randomCustomer.id, // Utilisez l'ID du client ici
          totalHt: randomPrice,
          totalTtc: randomPrice, // Pour simplifier, nous utilisons le même prix pour HT et TTC
        });
      } else {
        console.error("Aucun client trouvé pour créer une facture.");
        break; // Sortez de la boucle si aucun client n'est trouvé
      }
    }
  }
  if (invoices.length < 20) {
    for (let l = 0; l < 20; l++) {
      // Assurez-vous d'avoir des clients avant de continuer
      if (customers.length > 0) {
        const randomCustomerId = Math.floor(Math.random() * customers.length);
        const randomCustomer = customers[randomCustomerId]; // Ceci devrait être l'objet client
        const randomPrice = faker.commerce.price(); // Génère un prix aléatoire

        await Invoice.create({
          date: faker.date.past(), // Utilise faker pour générer une date passée aléatoire
          customerId: randomCustomer.id, // Utilisez l'ID du client ici
          totalHt: randomPrice,
          totalTtc: randomPrice, // Pour simplifier, nous utilisons le même prix pour HT et TTC
        });
      } else {
        console.error("Aucun client trouvé pour créer une facture.");
        break; // Sortez de la boucle si aucun client n'est trouvé
      }
    }
  }
  if (invoicelines.length < 20) {
    for (let i = 0; i < 20; i++) {
      // Assurez-vous que vous avez suffisamment de produits et de factures avant de continuer
      if (invoices.length > 0) {
        const randomProductId = Math.floor(Math.random() * 20) + 1; // Remplacez 100 par le nombre total de produits dans votre base de données
        const randomQuantity = Math.floor(Math.random() * 10) + 1; // Générer une quantité aléatoire entre 1 et 10
        const randomPriceHt = faker.commerce.price(); // Générer un prix HT aléatoire

        await Invoiceline.create({
          invoiceId: Math.floor(Math.random() * 20) + 1, // Remplacez 20 par le nombre total de factures dans votre base de données
          productId: randomProductId,
          quantity: randomQuantity,
          priceHt: randomPriceHt,
          productName: faker.commerce.productName(), // Générer un nom de produit fictif
        });
      } else {
        console.error(
          "Aucune facture trouvée pour créer une ligne de facture."
        );
        break; // Sortez de la boucle si aucune facture n'est trouvée
      }
    }
  }
}
