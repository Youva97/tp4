// invoice.model.js
const { sequelize, DataTypes } = require("./db.js");

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "customers",
      key: "id",
    }
  },
  totalHt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  totalTtc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
});


module.exports = Invoice;
