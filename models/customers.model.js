const { sequelize, DataTypes } = require("./db.js");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  address1: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  address2: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  city: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // Nom de la table tel qu'il apparaît dans la base de données
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "NO ACTION",
  },
});

module.exports = Customer;
