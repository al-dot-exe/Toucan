const { sequelize } = require('../config/database');  //bring in Sequelize instance
const { DataTypes, Model } = require('sequelize');

// Torrent Schema
class Torrent extends Model {}
const TorrentSchema = Torrent.init({
   id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
   },
   dotTorrent: {
      type: DataTypes.BLOB,
      allowNull: false,
      unique: true // ensures torrent files won't be uploaded multiple times
   },
   category: {
      type: DataTypes.STRING
   },
   piecesFolder: {
      type: DataTypes.TEXT // path to grab torrent files later
   },
}, {
      sequelize,
      paranoid: true, // won't delete torrent database even if DELETE From is accidently called
      deletedAt: 'destroyTime'
});

console.log('Synchronizing Torrent Schema');
TorrentSchema.sync();


module.exports = ('Torrent', TorrentSchema);
