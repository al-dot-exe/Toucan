const { Sequelize } = require('sequelize');

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
      // might need to remove sync in production build
      // await sequelize.sync();
      // console.log("Synchronizing all databases.");
   } catch (err) {
      console.error(`Database connection failed\nError: err`);
   }
}

module.exports = { sequelize, connectDB };
