module.exports = (sequelize, DataTypes) => {
  const DetalleCompra = sequelize.define('DetalleCompra', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    compraId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ubicacionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { isInt: true, min: 1 } },
    costoUnitario: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false },
  }, { tableName: 'detalles_compras' });
  DetalleCompra.associate = ({ Compra, Producto, Ubicacion }) => {
    DetalleCompra.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' });
    DetalleCompra.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
    DetalleCompra.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });
  };
  return DetalleCompra;
};
