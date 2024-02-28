// fichier /models/aclroleresource.model.js
const { sequelize, DataTypes } = require('./db.js');
const AclRoleResource = sequelize.define('AclRoleResource', {
    role: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    resource: {
        type: DataTypes.STRING,
        primaryKey: true
    },
});


module.exports = AclRoleResource;