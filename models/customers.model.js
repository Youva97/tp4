const { sequelize, DataTypes } = require("./db.js");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  firstname: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  address1: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  address2: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  zipCode: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});

module.exports = Customer;
