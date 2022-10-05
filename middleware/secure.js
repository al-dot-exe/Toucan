require("dotenv").config({ path: "../config/.env" }); // .env config route
module.exports = {
  ensureSecure: (req, res, next) => {

    const HTTPS = process.env.PORT_HTTPS || 5000;
      if (req.protocol !== "https" || !req.protocol) {
        return res.redirect("https://" + req.hostname + `:${HTTPS}` + req.url);
    } else {
      return next();
    }
  },
};
