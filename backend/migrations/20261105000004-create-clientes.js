'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(120), allowNull: false },
      documento: { type: Sequelize.STRING(50), allowNull: true, unique: true },
      correo: { type: Sequelize.STRING(150), allowNull: true },
      telefono: { type: Sequelize.STRING(20), allowNull: true },
      direccion: { type: Sequelize.STRING(255), allowNull: true },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clientes');
  },
};
