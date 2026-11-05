module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define(
    'Producto',
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
      codigo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [1, 30],
        },
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      cantidad: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          isInt: true,
          min: 0,
        },
      },
      categoriaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id',
        },
      },
      proveedorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'proveedores',
          key: 'id',
        },
      },
    },
    { tableName: 'productos' },
  );

  Producto.associate = ({ Categoria, Proveedor, Existencia, MovimientoInventario, DetalleCompra, DetalleVenta, AjusteInventario }) => {
    Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
    Producto.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' });
    Producto.hasMany(Existencia, { foreignKey: 'productoId', as: 'existencias' });
    Producto.hasMany(MovimientoInventario, { foreignKey: 'productoId', as: 'movimientosInventario' });
    Producto.hasMany(DetalleCompra, { foreignKey: 'productoId', as: 'detallesCompra' });
    Producto.hasMany(DetalleVenta, { foreignKey: 'productoId', as: 'detallesVenta' });
    Producto.hasMany(AjusteInventario, { foreignKey: 'productoId', as: 'ajustesInventario' });
  };

  return Producto;
};
