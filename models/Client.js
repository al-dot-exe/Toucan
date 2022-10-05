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
      allowNull: true,
    },
    downloadLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 307000,
      allowNull: true,
    },
    uploadLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 529000,
      allowNull: true,
    },
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
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    lsd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },

    // Advanced Settings
    webSeeds: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    utp: {
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
    // paranoid: true, // Keep this on so the client settings in the database are never deleted once created
  }
);

module.exports = ("Client", ClientSchema);
