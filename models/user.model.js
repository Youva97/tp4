const { sequelize, DataTypes } = require('./db.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firsname: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    lastname: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    login: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    password: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: '',
    }
});

module.exports = User;