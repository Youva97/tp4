// invoiceline.model.js
const { sequelize, DataTypes } = require("./db.js");

const Invoiceline = sequelize.define("Invoiceline", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "products",
        key: "id",
      }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  priceHt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});



module.exports = Invoiceline;
