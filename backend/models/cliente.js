module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false, validate: { notEmpty: true, len: [1, 120] } },
  documento: { type: DataTypes.STRING(50), allowNull: true, unique: true, validate: { len: [0, 50] } },
  correo: { type: DataTypes.STRING(150), allowNull: true, validate: { isEmail: true, len: [0, 150] } },
  telefono: { type: DataTypes.STRING(20), allowNull: true, validate: { len: [0, 20] } },
  direccion: { type: DataTypes.STRING(255), allowNull: true, validate: { len: [0, 255] } },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'clientes' });
  Cliente.associate = ({ Venta }) => Cliente.hasMany(Venta, { foreignKey: 'clienteId', as: 'ventas' });
  return Cliente;
};
