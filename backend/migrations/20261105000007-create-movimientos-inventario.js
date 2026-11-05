'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movimientos_inventario', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      productoId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'productos', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      tipoMovimientoId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'tipos_movimiento', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      ubicacionOrigenId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'ubicaciones', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      ubicacionDestinoId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'ubicaciones', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      cantidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      motivo: { type: Sequelize.STRING(255), allowNull: true },
      referencia: { type: Sequelize.STRING(100), allowNull: true },
      usuarioId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      fechaMovimiento: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('movimientos_inventario', {
      fields: ['cantidad'], type: 'check',
      where: { cantidad: { [Sequelize.Op.gt]: 0 } },
      name: 'movimientos_cantidad_positiva',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('movimientos_inventario');
  },
};
