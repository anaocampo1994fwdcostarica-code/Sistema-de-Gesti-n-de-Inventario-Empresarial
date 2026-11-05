module.exports = (sequelize, DataTypes) => {
  const DetalleVenta = sequelize.define('DetalleVenta', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    ventaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ubicacionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { isInt: true, min: 1 } },
    precioUnitario: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false },
  }, { tableName: 'detalles_ventas' });
  DetalleVenta.associate = ({ Venta, Producto, Ubicacion }) => {
    DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId', as: 'venta' });
    DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
    DetalleVenta.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });
  };
  return DetalleVenta;
};
