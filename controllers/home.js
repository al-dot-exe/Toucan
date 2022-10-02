// Home Controller
const User = require("../models/User");
const Client = require("../models/Client");
const { client } = require("../config/webtorrent");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      res.render("index", {
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(404).send("Page doesn't exist");
    }
  },
  getSettings: async (req, res) => {
    try {
      settings = await Client.findByPk(0);
      const user = await User.findByPk(req.user.id);
      res.render("settings", {
        user,
        settings,
      });
    } catch (err) {
      console.error(err);
      res.status(404).send("Page doesn't exist");
    }
  },
  updateSettings: async (req, res) => {
    try {
      if (req.path === "/reset-settings") {
        console.log("Resetting Toucan settings");
        const currentSettings = await Client.findByPk(0);
        await currentSettings.destroy();
        await Client.create({ where: { id: 0 } });
      } else {
        console.log("\nUpdating user account");
        User.update(
          { email: req.body.email, userName: req.body.userName },
          {
            where: { id: req.user.id },
          }
        );
        console.log("\nUpdating Toucan torrent settings");
        // Updating database
        Client.update(
          {
            maxConns: req.body.maxConns,
            downloadLimit:
              Number(req.body.downloadLimit) === -1
                ? -1
                : Number(req.body.downloadLimit) * 1000,
            uploadLimit:
              Number(req.body.uploadLimit) === -1
                ? -1
                : Number(req.body.uploadLimit) * 1000,
            tracker: req.body.tracker,
            blockList: req.body.blockList,
            dht: req.body.dht,
            lsd: req.body.lsd,
          },
          {
            where: {
              id: 0,
            },
          }
        );
      }

      // Updating running webtorrent instance
      const newSettings = await Client.findByPk(0);
      client.maxUpRate = newSettings.uploadLimit;
      client.maxDownRate = newSettings.downloadLimit;
      client.maxConns = newSettings.maxConns;
      client.webSeeds = newSettings.webSeeds;
      client.tracker = newSettings.tracker;
      client.blockList = newSettings.blockList;
      client.dht = newSettings.dht;
      client.lsd = newSettings.lsd;

      console.log("\nSettings have been updated");
      req.flash("info", {
        msg: `Settings have been updated`,
      });
      res.redirect("settings");
    } catch (err) {
      console.log("Something went wrong...");
      console.error(err);
      res.redirect("settings");
    }
  },

  deleteAccount: async (req, res) => {
    try {
      currentUser = await User.findByPk(req.user.id);
      currentUser.destroy();
      const user = req.user.id;
      await req.logout(() => {
        console.log(`Account id:${user} has been deleted.`);
      });
      req.user = null;
      req.flash("info", {
        msg: `Account has been deleted`,
      });
      res.redirect("/login");
    } catch (err) {
      console.log(`\nIt looks like there was an error deleting user`)
      console.error(err);
      req.flash("errors", {
        msg: `It looks like there was an error. Account has not been deleted`,
      });
      res.redirect("/");
    }
  }
};
