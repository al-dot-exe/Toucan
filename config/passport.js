const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = (passport) => {
   passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

      try {
         const user = await (User.findOne({
            where: {
               email: email.toLowerCase()
            }
         }));
         return ((!user) || (!user.authenticate(password)))
            ? done(null, false, { msg: `Incorrect email or password.` })
            : done(null, user);
      } catch (err) {
         console.error(err);
         return done(err);
      }
   }));

   passport.serializeUser((user, done) => {
      done(null, user.id)
   })

   passport.deserializeUser(async (id, done) => {
      try {
         const user = await User.findByPk(id);
         done(null, user);
      } catch (err) {
         console.error(err);
         done(err);
      }
   });
}
