const { sequelize } = require("./db.js");
const Product = require("./product.model.js");
const Type = require("./type.model.js");
const User = require("./user.model.js");
const Customer = require("./customers.model.js"); // Assurez-vous que le nom du fichier est correct
const Invoice = require("./invoice.model.js");
const Invoiceline = require("./invoiceline.model.js");
const AclRole = require("./AclRole.model.js");
const AclResource = require("./AclResource.model.js");
const AclRoleResource = require("./AclRoleResource.model.js");

// Associations pour Type et Product
Product.belongsTo(Type, { foreignKey: "typeId", as: "type" });
Type.hasMany(Product, { foreignKey: "typeId", as: "products" });

// Association pour Customer et User
Customer.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Customer, { foreignKey: "userId", as: "customers" });

Customer.hasMany(Invoice, { foreignKey: "customerId", as: "invoices" });
// Associations correctes pour Invoice et Invoiceline

Invoice.hasMany(Invoiceline, { as: "lines", foreignKey: "invoiceId" });
Invoiceline.belongsTo(Invoice, { as: "invoice", foreignKey: "invoiceId" });

// Correction pour l'association entre Invoiceline et Product
Invoiceline.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(Invoiceline, { foreignKey: "productId", as: "invoicelines" });

module.exports = {
  sequelize,
  Product,
  Type,
  User,
  Customer,
  Invoice,
  Invoiceline,
  AclRole,
  AclResource,
  AclRoleResource,
};
