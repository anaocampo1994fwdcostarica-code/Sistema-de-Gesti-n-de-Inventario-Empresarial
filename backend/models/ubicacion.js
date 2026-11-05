module.exports = (sequelize, DataTypes) => {
  const Ubicacion = sequelize.define('Ubicacion', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    bodegaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    codigo: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true, len: [1, 50] } },
    nombre: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true, len: [1, 100] } },
    pasillo: { type: DataTypes.STRING(30), allowNull: true, validate: { len: [0, 30] } },
    estante: { type: DataTypes.STRING(30), allowNull: true, validate: { len: [0, 30] } },
    nivel: { type: DataTypes.STRING(30), allowNull: true, validate: { len: [0, 30] } },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: 'ubicaciones',
    indexes: [{ unique: true, fields: ['bodegaId', 'codigo'] }],
  });

  Ubicacion.associate = ({ Bodega, Existencia, MovimientoInventario, DetalleCompra, DetalleVenta, AjusteInventario }) => {
    Ubicacion.belongsTo(Bodega, { foreignKey: 'bodegaId', as: 'bodega' });
    Ubicacion.hasMany(Existencia, { foreignKey: 'ubicacionId', as: 'existencias' });
    Ubicacion.hasMany(MovimientoInventario, { foreignKey: 'ubicacionOrigenId', as: 'movimientosSalida' });
    Ubicacion.hasMany(MovimientoInventario, { foreignKey: 'ubicacionDestinoId', as: 'movimientosEntrada' });
    Ubicacion.hasMany(DetalleCompra, { foreignKey: 'ubicacionId', as: 'detallesCompra' });
    Ubicacion.hasMany(DetalleVenta, { foreignKey: 'ubicacionId', as: 'detallesVenta' });
    Ubicacion.hasMany(AjusteInventario, { foreignKey: 'ubicacionId', as: 'ajustesInventario' });
  };

  return Ubicacion;
};
