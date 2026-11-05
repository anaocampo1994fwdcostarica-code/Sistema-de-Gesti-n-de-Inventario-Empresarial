const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const db = {
  Categoria: require('./categoria')(sequelize, DataTypes),
  Proveedor: require('./proveedor')(sequelize, DataTypes),
  Producto: require('./producto')(sequelize, DataTypes),
  Usuario: require('./usuario')(sequelize, DataTypes),
  Bodega: require('./bodega')(sequelize, DataTypes),
  TipoMovimiento: require('./tipoMovimiento')(sequelize, DataTypes),
  Cliente: require('./cliente')(sequelize, DataTypes),
  Ubicacion: require('./ubicacion')(sequelize, DataTypes),
  Existencia: require('./existencia')(sequelize, DataTypes),
  MovimientoInventario: require('./movimientoInventario')(sequelize, DataTypes),
  Compra: require('./compra')(sequelize, DataTypes),
  DetalleCompra: require('./detalleCompra')(sequelize, DataTypes),
  Venta: require('./venta')(sequelize, DataTypes),
  DetalleVenta: require('./detalleVenta')(sequelize, DataTypes),
  AjusteInventario: require('./ajusteInventario')(sequelize, DataTypes),
};

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
