module.exports = (sequelize, DataTypes) => {
  const Compra = sequelize.define('Compra', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    proveedorId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('BORRADOR', 'CONFIRMADA', 'ANULADA'), allowNull: false, defaultValue: 'BORRADOR' },
    total: { type: DataTypes.DECIMAL(12, 2).UNSIGNED, allowNull: false, defaultValue: 0 },
    claveIdempotencia: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  }, { tableName: 'compras' });
  Compra.associate = ({ Proveedor, Usuario, DetalleCompra }) => {
    Compra.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' });
    Compra.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Compra.hasMany(DetalleCompra, { foreignKey: 'compraId', as: 'detalles' });
  };
  return Compra;
};
