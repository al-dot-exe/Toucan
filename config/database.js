const { Sequelize } = require("sequelize");
const ExtendedDataTypes = require("./datatypes").default;

// Provides extended data type for handling torrent ids
ExtendedDataTypes(Sequelize);

// sqlite instance
const sequelize = new Sequelize({
  storage: "database/db.sqlite",
  host: "localhost",
  dialect: "sqlite",
  logging: (process.env.NODE_ENV === "development") ? true : false
});

const connectDB = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("\nConnected to database");
    console.log("\nSynchronizing database tables...");
    try {
      await sequelize.sync();
      console.log("\nDatabase is now Nsync");
    } catch (err) {
      console.log("\nLooks like we ran into an error when syncing the database <.<");
      console.error(err);
    }
  } catch (err) {
    console.error(`\nDatabase connection failed\nError: ${err}`);
  }
};

module.exports = { sequelize, connectDB };
