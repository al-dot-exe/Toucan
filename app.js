const express = require("@feathersjs/express"); //MVC framework
const feathers = require("@feathersjs/feathers"); //Realtime framework
const socketio = require("@feathersjs/socketio"); //Realtime APIs with websockets
const expressLayouts = require("express-ejs-layouts"); //Ejs layouts structure
const methodOverride = require("method-override"); //Override http methods
const logger = require("morgan"); //Logging
const path = require("path"); //directory traversal
const multer = require("multer"); //file uploads
const cors = require("cors"); //Cross origin resource sharing
const helmet = require("helmet"); //Default security headers
const passport = require("passport"); //authentication middleware
const session = require("express-session"); //login session middleware
const sessionStorage = require("express-session-sequelize")(session.Store); //Session storage
const cookieParser = require("cookie-parser"); //Session cookie parser
const flash = require("express-flash"); //pop up messages
const homeRoutes = require("./routes/home"); //Home routes
const torrentRoutes = require("./routes/torrents"); //Torrent client routes;
// const homeServices = require('./services/home') // Main services
const torrentServices = require("./services/torrent.services"); //Torrent services
const clientServices = require("./services/client.services"); //Torrent client services
const { sequelize, connectDB } = require("./config/database"); //Sqlite database
const { startToucan } = require("./config/webtorrent"); //Start WebTorrent client

/*
* Feathers|Express init
*/
const app = express(feathers());

/*
* .ENV config
*/
require("dotenv").config({ path: "config/.env" });

/*
* Passport init
*/
require("./config/passport")(passport);

/*
* Database init
*/
connectDB();

/*
* Toucan init
*/
startToucan();

/*
* Security middleware
*/
app.use(cors());
app.use(
   helmet({
      //Feathers js CORSP is currently not set on their end
      crossOriginEmbedderPolicy: false, // band-aid
   })
);
app.use(
   helmet.contentSecurityPolicy({
      directives: {
         "default-src": [
            "'self'",
            "data:",
            "https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js",
            "https://unpkg.com/@feathersjs/client@%5E4.3.0/dist/feathers.js",
            "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js",
         ],
         "script-src": [
            "'self'",
            "eval",
            "https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js",
            "https://unpkg.com/@feathersjs/client@%5E4.3.0/dist/feathers.js",
            "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js",
         ],
      },
   })
);
/*HTTPS will be here*/

/*
* Frontend middleware
*/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/loggedIn"); // default layout
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.configure(socketio());
app.configure(express.rest()); // to view services json, can also use rest.nvim


/*
* Method Override middleware
*/
app.use(
   methodOverride((req, res) => {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
         // look in urlencoded POST bodies and replaces it with another method
         let method = req.body._method;
         delete req.body._method;
         return method;
      }
   })
);

/*
* Session middleware
*/
app.use(cookieParser());
app.use(
   session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new sessionStorage({ db: sequelize }),
   })
);

/*
* Authentication middleware
*/
app.use(passport.initialize());
app.use(passport.session()); // login sessions
app.use(flash());

/*
* Feathers middleware
*/
// connection to connect stream channel
app.on("connection", (conn) => app.channel("stream").join(conn));

//Publish events to 'stream' channel
app.publish((data) => app.channel("stream"));


/*
* Services
*/
app.use("/torrent-services", torrentServices);
app.use("/client-services", clientServices);

/*
* Routes
*/
app.use("/", homeRoutes);
app.use("/torrents", torrentRoutes);

/*
* App start
*/
if (process.env.NODE_ENV === "development") logger("dev");
const PORT = process.env.PORT || 5000;
app
   .listen(PORT)
   .on("listening", () =>
      console.log(
         `Toucan flying in ${process.env.NODE_ENV} mode on port ${PORT}!`
      )
   );
