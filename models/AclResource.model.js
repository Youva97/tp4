// fichier /models/aclresource.model.js
const { sequelize, DataTypes } = require('./db.js');
const AclResource = sequelize.define('AclResource', {
    resource: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: null,
    },
});
module.exports = AclResource;