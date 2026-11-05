module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
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
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [1, 150],
      },
    },
    passwordHash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'usuarios',
    createdAt: 'fechaCreacion',
  });

  Usuario.associate = ({ MovimientoInventario, Compra, Venta, AjusteInventario }) => {
    Usuario.hasMany(MovimientoInventario, { foreignKey: 'usuarioId', as: 'movimientosInventario' });
    Usuario.hasMany(Compra, { foreignKey: 'usuarioId', as: 'compras' });
    Usuario.hasMany(Venta, { foreignKey: 'usuarioId', as: 'ventas' });
    Usuario.hasMany(AjusteInventario, { foreignKey: 'usuarioId', as: 'ajustesInventario' });
  };

  return Usuario;
};
