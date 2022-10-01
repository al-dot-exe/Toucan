const { sequelize } = require("../config/database");
const { DataTypes, Model } = require("sequelize");

// Torrent Schema
class Torrent extends Model { }

const TorrentSchema = Torrent.init(
  {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    torrentID: {
      type: DataTypes.TORRENTID,
      allowNull: false,
      unique: true,
    },
    folderPath: {
      type: DataTypes.TEXT, // path to grab torrent files later
    },
    category: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    // paranoid: true, // won't delete torrent database even if DELETE From is accidently called
  }
);

// const syncTorrentTable = async () => {
//   await Torrent.sync().then((data) => {
//     console.log("Synchronized Torrent table");
//   });
// };

// syncTorrentTable();

module.exports = ("Torrent", TorrentSchema);
