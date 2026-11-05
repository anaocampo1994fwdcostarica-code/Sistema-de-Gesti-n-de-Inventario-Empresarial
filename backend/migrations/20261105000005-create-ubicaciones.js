'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ubicaciones', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      bodegaId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'bodegas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      codigo: { type: Sequelize.STRING(50), allowNull: false },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      pasillo: { type: Sequelize.STRING(30), allowNull: true },
      estante: { type: Sequelize.STRING(30), allowNull: true },
      nivel: { type: Sequelize.STRING(30), allowNull: true },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('ubicaciones', {
      fields: ['bodegaId', 'codigo'],
      type: 'unique',
      name: 'ubicaciones_bodega_codigo_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ubicaciones');
  },
};
