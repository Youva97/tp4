const { sequelize, DataTypes } = require('./db.js');

const Type = sequelize.define('Type', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
}, {
});


module.exports = Type;
