'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'activo', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: 'passwordHash',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'activo');
  },
};
