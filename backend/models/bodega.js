module.exports = (sequelize, DataTypes) => {
  const Bodega = sequelize.define('Bodega', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { notEmpty: true, len: [1, 100] } },
  descripcion: { type: DataTypes.STRING(255), allowNull: true, validate: { len: [0, 255] } },
  direccion: { type: DataTypes.STRING(255), allowNull: true, validate: { len: [0, 255] } },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'bodegas' });

  Bodega.associate = ({ Ubicacion }) => {
    Bodega.hasMany(Ubicacion, { foreignKey: 'bodegaId', as: 'ubicaciones' });
  };

  return Bodega;
};
