module.exports = {
  ensureSecure: (req, res, next) => {
    console.log(req);
    if (process.env.NODE_ENV === "production") {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect("https://" + req.headers.host + req.url);
      } else {
        return next();
      }
    } else {
      return next();
    }
  },
};
