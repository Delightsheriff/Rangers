'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      user_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.DataTypes.ENUM('male', 'female', 'others'),
        allowNull: false,
      },
      dob: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
