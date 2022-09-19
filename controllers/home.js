// Home Controller
const User = require('../models/User');

module.exports = {
   getIndex: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         res.render('index', {
            user
         });
      } catch (err) {
         console.error(err);
         res.status(404).send("Page doesn't exist");
      }
   },
   getTraversyExample: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         res.render('traversy', {
            user
         });
      } catch (err) {
         console.error(err);
         res.status(404).send("Page doesn't exist");
         res.redirect('../')
         
      }
   },
   getSettings: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         res.render('settings', {
            user
         });
      } catch (err) {
         console.error(err);
         res.status(404).send("Page doesn't exist");
      }
   },
   redirectExample: async (req, res) => {
      try {
         console.log('Success!!!');
         res.redirect('../');
      } catch (err) {
         console.log('Something went wrong...');
         console.error(err);
         res.redirect('../');
      }
   }
}
