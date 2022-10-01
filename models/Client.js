const { sequelize } = require("../config/database");
const { DataTypes, Model } = require("sequelize");

// Client Schema
class Client extends Model { }

const ClientSchema = Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    maxConns: {
      type: DataTypes.INTEGER,
      defaultValue: 250,
      allowNull: false,
    },
    downloadLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 307000,
      allowNull: false,
    },
    uploadLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 529000,
      allowNull: false,
    },
    webseeds: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    utp: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    // Advanced Settings
    tracker: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    blockList: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },
    dht: {
      type: DataTypes.BOOLEAN, // band-aid (see webtorrent docs)
      defaultValue: false,
      allowNull: true,
    },
    lsd: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    peerID: {
      type: DataTypes.TORRENTID,
      allowNull: true,
    },
    nodeID: {
      type: DataTypes.TORRENTID,
      allowNull: true,
    },
  },
  {
    sequelize,
    // paranoid: true, // WILL be keeping this on so client instance is never deleted once started
  }
);
const settingsCheck = async () => {
  console.log('Syncing client table')
  await Client.sync();
  console.log("Checking for client settings");
  // await Client.findOrCreate({ where: { id: 0 } });
  console.log('Client Settings check complete');
};

settingsCheck();

module.exports = ("Client", ClientSchema);
