const { sequelize } = require('../config/database');
const { DataTypes, Model } = require('sequelize');

// Torrent Schema
class Torrent extends Model {}

const TorrentSchema = Torrent.init({
   id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      primaryKey: true
      // type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      // allowNull: false,
      // unique: true,
      // primaryKey: true
   },
   name: {
      type: DataTypes.STRING,
      allowedNull: false,
   },
   torrentID: {
      type: DataTypes.TEXT,
      allowNull: false,
   },
   folderPath: {
      type: DataTypes.TEXT // path to grab torrent files later
   },
   category: {
      type: DataTypes.STRING
   },
}, {
      sequelize,
      paranoid: true, // won't delete torrent database even if DELETE From is accidently called
});

module.exports = ('Torrent', TorrentSchema);
