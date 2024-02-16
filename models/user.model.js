const { sequelize, DataTypes } = require("./db.js");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  login: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
  token: {
    type: DataTypes.STRING,
    allowNull: null,
    defaultValue: "",
  },
});

module.exports = User;
