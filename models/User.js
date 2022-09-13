const { sequelize } = require('../config/database');
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('sequelize-bcrypt');

// User Schema
class User extends Model {}
const UserSchema = User.init({
   id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
   },
   email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   },
   userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false
   }
}, {
      sequelize
});

// Password hashing middleware
bcrypt(UserSchema)

module.exports = ('User', UserSchema);
