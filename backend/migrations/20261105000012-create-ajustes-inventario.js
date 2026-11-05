'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ajustes_inventario', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      productoId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'productos', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      ubicacionId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'ubicaciones', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      usuarioId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      cantidadAnterior: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      cantidadNueva: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      diferencia: { type: Sequelize.INTEGER, allowNull: false },
      motivo: { type: Sequelize.STRING(255), allowNull: false },
      movimientoInventarioId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true, unique: true, references: { model: 'movimientos_inventario', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      claveIdempotencia: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      fecha: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false }, updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('ajustes_inventario'); },
};
