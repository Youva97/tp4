const { sequelize, DataTypes } = require("./db.js");
const Product = require("./product.model.js");
const Type = require("./type.model.js");
const User = require("./user.model.js");
const Customer = require("./customers.model.js");

Product.belongsTo(Type, { foreignKey: "typeId", as: "type" });
Type.hasMany(Product, { foreignKey: "typeId", as: "products" });

module.exports = {
  sequelize,
  DataTypes,
  Product,
  Type,
  User,
  Customer,
};
