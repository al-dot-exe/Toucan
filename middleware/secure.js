require("dotenv").config({ path: "config/.env" }); // .env config route
//
module.exports = {
  ensureSecure: (req, res, next) => {
    const HTTPS = process.env.PORT_HTTPS || 5000;
    if (process.env.NODE_ENV === "production") {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect("https://" + req.headers.host + req.url + `:${HTTPS}`);
      } else {
        return next();
      }
    } else {
      return next();
    }
  },
};
