const { Sequelize } = require('sequelize');
const ExtendedDataTypes = require('./datatypes').default;

// Provides extended data type for handling torrent ids
ExtendedDataTypes(Sequelize);

// sqlite instance
const sequelize = new Sequelize({
   storage: 'database/db.sqlite',
   host: 'localhost',
   dialect: 'sqlite',
});

const connectDB = async _ => {
   try {
      await sequelize.authenticate();
      console.log('Database connection succesful');
   } catch (err) {
      console.error(`Database connection failed\nError: err`);
   }
}


module.exports = { sequelize, connectDB };
