// Authentication Controller

const passport = require("passport");
const { Op } = require("sequelize");
const validator = require("validator");
const User = require("../models/User");

module.exports = {
  getLogin: (req, res) => {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("login", {
      title: "Login",
      layout: 'layouts/loggedOut'
    });
  },

  postLogin: (req, res, next) => {
    const validationErrors = [];

    console.log(req.body.account)
    if (req.body.account.split(" ").join() !== req.body.account) {
      validationErrors.push({
        msg: "Please enter a valid username or email address.",
      });
    }
    if (validator.isEmpty(req.body.password)) {
      validationErrors.push({ msg: "Password cannot be blank." });
    }

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      console.log('got validation error');
      return res.redirect("/login");
    }

    if (validator.isEmail(req.body.account)) {
      req.body.account = validator.normalizeEmail(req.body.account, {
        gmail_remove_dots: false,
      });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", info);
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/");
      });
    })(req, res, next);
  },

  logout: async (req, res) => {
    const user = req.user.userName;
    try {
      await req.logout(() => {
        console.log(`${user} has logged out.`);
      });
      req.user = null;
      req.flash("info", { msg: "Logged out" });
      res.redirect("/login");
    } catch (err) {
      console.error(err);
      res.status("500").end();
    }
  },

  getSignup: (req, res) => {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("signup", {
      title: "Create Account",
      layout: 'layouts/loggedOut'
    });
  },

  postSignup: async (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (req.body.password !== req.body.confirmPassword)
      validationErrors.push({ msg: "Passwords do not match" });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }

    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    const user = User.build({
      userName: req.body.userName.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });

    try {
      // querying Users table to see if user exists
      const userExists = await User.findOne({
        where: {
          [Op.or]: [
            { email: req.body.email.toLowerCase() },
            { userName: req.body.userName.toLowerCase() },
          ],
        },
      });
      if (userExists) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      } else {
        await user.save();
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", { msg: "Success! You are logged in." });
          res.redirect(req.session.returnTo || "/");
        });
      }
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
};
