module.exports = (sequelize, DataTypes) => {
  const MovimientoInventario = sequelize.define('MovimientoInventario', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tipoMovimientoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ubicacionOrigenId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    ubicacionDestinoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { isInt: true, min: 1 } },
    motivo: { type: DataTypes.STRING(255), allowNull: true, validate: { len: [0, 255] } },
    referencia: { type: DataTypes.STRING(100), allowNull: true, validate: { len: [0, 100] } },
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fechaMovimiento: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'movimientos_inventario' });

  MovimientoInventario.associate = ({ Producto, TipoMovimiento, Ubicacion, Usuario, AjusteInventario }) => {
    MovimientoInventario.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
    MovimientoInventario.belongsTo(TipoMovimiento, { foreignKey: 'tipoMovimientoId', as: 'tipoMovimiento' });
    MovimientoInventario.belongsTo(Ubicacion, { foreignKey: 'ubicacionOrigenId', as: 'ubicacionOrigen' });
    MovimientoInventario.belongsTo(Ubicacion, { foreignKey: 'ubicacionDestinoId', as: 'ubicacionDestino' });
    MovimientoInventario.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    MovimientoInventario.hasOne(AjusteInventario, { foreignKey: 'movimientoInventarioId', as: 'ajusteInventario' });
  };

  return MovimientoInventario;
};
