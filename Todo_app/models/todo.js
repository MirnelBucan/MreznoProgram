'use strict';
module.exports = (sequelize, DataTypes) => {
  const todo = sequelize.define('todo', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {})

  todo.associate = function(models) {
    todo.belongsTo(models.users, {
        onDelete: 'CASCADE'
    });
  };
  return todo;
};