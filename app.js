const express = require('@feathersjs/express');                                   //MVC framework
const feathers = require('@feathersjs/feathers');                                 //Realtime framework
const expressLayouts = require('express-ejs-layouts');                            //Ejs layouts structure
const logger = require('morgan');                                                 //Logging
const path = require('path');                                                     //directory traversal
const multer = require('multer');                                                 //file uploads
const cors = require('cors');                                                     //Cross origin resource sharing
const helmet = require('helmet');                                                 //Default security headers
const passport = require('passport');                                             //authentication middleware
const session = require('express-session');                                       //login session middleware
const sessionStorage = require('express-session-sequelize')(session.Store);       //Session storage
const cookieParser = require('cookie-parser');                                    //Session cookie parser
const flash = require('express-flash');                                           //pop up messages
const homeRoutes = require('./routes/home');                                      //Home routes
const torrentRoutes = require('./routes/torrents.js');                            //Torrent client routes;
const { sequelize, connectDB }= require('./config/database');                     //Sqlite database
const { startToucan } = require('./config/webtorrent');                           //Start WebTorrent client

// Feathers Express init
const app = express(feathers());

// .env config
require('dotenv').config({ path: 'config/.env' });

// Passport init
require('./config/passport')(passport);

// Database init
connectDB();

// Toucan Torrent init
startToucan();


// Client side middleware
app.use(cors());
app.use(helmet());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/loggedIn');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(cookieParser())
app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false,
   store: new sessionStorage({ db: sequelize })
}));

// Authentication Middleware
app.use(passport.initialize());
app.use(passport.session()); // login sessions
app.use(flash()); // flash messages // requires sessions


// Routes
app.use('/', homeRoutes);
app.use('/torrents', torrentRoutes);


// App start
if (process.env.NODE_ENV === 'development') logger('dev');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Toucan flying in ${process.env.NODE_ENV} mode on port ${PORT}!`));
