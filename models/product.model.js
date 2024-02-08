const { sequelize, DataTypes } = require('./db.js');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        // allowNull: false, 
    },
    description: {
        type: DataTypes.TEXT,
    },
    typeId: {
        type: DataTypes.INTEGER,
    },
    // le prix en centimes (prix€ * 100)
    priceHt: {
        type: DataTypes.INTEGER,
    },
}, {
    indexes: [
        {
            fields: ['typeId']
        },
    ]
});
Product.prototype.getImg = function () {
    let img = path.join(__dirname, "assets", "images", "products", this.id + ".jpg");
    if (!fs.existsSync(img)) img = path.join(__dirname, "assets", "images", "products", "default.jpg");
    return img;
}


module.exports = Product;
