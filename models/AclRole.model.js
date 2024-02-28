// fichier /models/aclrole.model.js
const { sequelize, DataTypes } = require('./db.js');
const AclRole = sequelize.define('AclRole', {
    role: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: null,
    },
});
module.exports = AclRole;