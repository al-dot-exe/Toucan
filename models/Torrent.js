const { sequelize } = require('../config/database');  //bring in Sequelize instance
const { DataTypes, Model } = require('sequelize');

// Torrent Schema
class Torrent extends Model {}
Torrent.init({
   _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
   },
}, {
      sequelize,
      paranoid: true, // won't delete torrent database even if DELETE From is accidently called
      deletedAt: 'destroyTime'
});

console.log("Torrent Stuff");


module.exports = Torrent;
