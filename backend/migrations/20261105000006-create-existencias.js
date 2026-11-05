'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('existencias', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      productoId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'productos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ubicacionId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'ubicaciones', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cantidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      version: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('existencias', {
      fields: ['productoId', 'ubicacionId'],
      type: 'unique',
      name: 'existencias_producto_ubicacion_unique',
    });
    await queryInterface.addConstraint('existencias', {
      fields: ['cantidad'],
      type: 'check',
      where: { cantidad: { [Sequelize.Op.gte]: 0 } },
      name: 'existencias_cantidad_no_negativa',
    });
    await queryInterface.addConstraint('existencias', {
      fields: ['version'],
      type: 'check',
      where: { version: { [Sequelize.Op.gte]: 0 } },
      name: 'existencias_version_no_negativa',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('existencias');
  },
};
