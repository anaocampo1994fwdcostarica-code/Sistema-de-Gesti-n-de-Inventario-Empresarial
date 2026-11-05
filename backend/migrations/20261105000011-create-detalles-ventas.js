'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalles_ventas', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      ventaId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'ventas', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      productoId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'productos', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      ubicacionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'ubicaciones', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      cantidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      precioUnitario: { type: Sequelize.DECIMAL(12, 2).UNSIGNED, allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2).UNSIGNED, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false }, updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('detalles_ventas', { fields: ['ventaId', 'productoId', 'ubicacionId'], type: 'unique', name: 'detalle_venta_documento_producto_ubicacion_unique' });
    await queryInterface.addConstraint('detalles_ventas', { fields: ['cantidad'], type: 'check', where: { cantidad: { [Sequelize.Op.gt]: 0 } }, name: 'detalle_venta_cantidad_positiva' });
  },
  async down(queryInterface) { await queryInterface.dropTable('detalles_ventas'); },
};
