const LocalStrategy = require("passport-local").Strategy;
const { Op } = require("sequelize");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "account" },
      async (account, password, done) => {
        try {
          const user = await User.findOne({
            where: {
              [Op.or]: [
                { email: account.toLowerCase() },
                { userName: account.toLowerCase() },
              ],
            },
          });
          return !user || !user.authenticate(password)
            ? done(null, false, { msg: `Incorrect account or password.` })
            : done(null, user);
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};
