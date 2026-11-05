module.exports = (sequelize, DataTypes) => {
  const Venta = sequelize.define('Venta', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    clienteId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('BORRADOR', 'CONFIRMADA', 'ANULADA'), allowNull: false, defaultValue: 'BORRADOR' },
    total: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false, defaultValue: 0 },
    claveIdempotencia: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  }, { tableName: 'ventas' });
  Venta.associate = ({ Cliente, Usuario, DetalleVenta }) => {
    Venta.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
    Venta.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId', as: 'detalles' });
  };
  return Venta;
};
