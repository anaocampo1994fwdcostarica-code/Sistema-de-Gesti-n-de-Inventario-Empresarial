module.exports = (sequelize, DataTypes) => {
  const Existencia = sequelize.define('Existencia', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    productoId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ubicacionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, validate: { isInt: true, min: 0 } },
    version: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, validate: { isInt: true, min: 0 } },
  }, {
    tableName: 'existencias',
    version: 'version',
    indexes: [{ unique: true, fields: ['productoId', 'ubicacionId'] }],
  });

  Existencia.associate = ({ Producto, Ubicacion }) => {
    Existencia.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
    Existencia.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });
  };

  return Existencia;
};
