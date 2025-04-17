'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_groups', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'groups', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_groups');
  },
};
