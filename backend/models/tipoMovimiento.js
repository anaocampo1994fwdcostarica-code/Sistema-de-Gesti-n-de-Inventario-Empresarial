module.exports = (sequelize, DataTypes) => {
  const TipoMovimiento = sequelize.define('TipoMovimiento', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING(30), allowNull: false, unique: true, validate: { notEmpty: true, len: [1, 30] } },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { notEmpty: true, len: [1, 100] } },
  efecto: { type: DataTypes.ENUM('ENTRADA', 'SALIDA', 'TRASLADO'), allowNull: false },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'tipos_movimiento' });

  TipoMovimiento.associate = ({ MovimientoInventario }) => {
    TipoMovimiento.hasMany(MovimientoInventario, { foreignKey: 'tipoMovimientoId', as: 'movimientos' });
  };

  return TipoMovimiento;
};
