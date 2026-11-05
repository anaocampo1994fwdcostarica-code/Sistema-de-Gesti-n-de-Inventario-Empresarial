module.exports = (sequelize, DataTypes) => {
  const AjusteInventario = sequelize.define('AjusteInventario', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ubicacionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    cantidadAnterior: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    cantidadNueva: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    diferencia: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true, len: [1, 255] } },
    movimientoInventarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: true },
    claveIdempotencia: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'ajustes_inventario' });
  AjusteInventario.associate = ({ Producto, Ubicacion, Usuario, MovimientoInventario }) => {
    AjusteInventario.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
    AjusteInventario.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });
    AjusteInventario.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    AjusteInventario.belongsTo(MovimientoInventario, { foreignKey: 'movimientoInventarioId', as: 'movimientoInventario' });
  };
  return AjusteInventario;
};
