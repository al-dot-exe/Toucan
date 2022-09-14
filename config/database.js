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
   } catch (err) {
      console.error(`Database connection failed\nError: err`);
   }
}

module.exports = { sequelize, connectDB };
