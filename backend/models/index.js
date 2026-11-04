const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const db = {
  Categoria: require('./categoria')(sequelize, DataTypes),
  Proveedor: require('./proveedor')(sequelize, DataTypes),
  Producto: require('./producto')(sequelize, DataTypes),
};

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
