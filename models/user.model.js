const { sequelize, DataTypes } = require("./db.js");
const crypto = require('crypto');

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
  role: {
    type: DataTypes.STRING,
  },
}, {
  indexes: [
      {
          fields: ["login"]
      },
  ],
  hooks: {
      beforeSave: (user) => {
          if (user.changed('password')) {
              user.password = crypto.createHash('sha256').update(user.password).digest('hex');
          }
      }
  }
});

module.exports = User;
