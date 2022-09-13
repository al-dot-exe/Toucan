const Torrent = require("../models/Torrent");
const User = require("../models/User");

module.exports = {
  getClientDashboard: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      res.render("dashboard", {
        user,
      });
    } catch (error) {
      console.error(err);
      res.status(404).end();
    }
  },
};
