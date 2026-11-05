module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define(
    'Proveedor',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: [0, 20],
        },
      },
      correo: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          isEmail: true,
          len: [0, 150],
        },
      },
    },
    { tableName: 'proveedores' },
  );

  Proveedor.associate = ({ Producto, Compra }) => {
    Proveedor.hasMany(Producto, { foreignKey: 'proveedorId', as: 'productos' });
    Proveedor.hasMany(Compra, { foreignKey: 'proveedorId', as: 'compras' });
  };

  return Proveedor;
};
