'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('compras', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      proveedorId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'proveedores', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      usuarioId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      fecha: { type: Sequelize.DATE, allowNull: false },
      estado: { type: Sequelize.ENUM('BORRADOR', 'CONFIRMADA', 'ANULADA'), allowNull: false, defaultValue: 'BORRADOR' },
      total: { type: Sequelize.DECIMAL(12, 2).UNSIGNED, allowNull: false, defaultValue: 0 },
      claveIdempotencia: { type: Sequelize.STRING(100), allowNull: true, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false }, updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('compras'); },
};
