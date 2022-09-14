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
}
