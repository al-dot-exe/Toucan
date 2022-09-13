const express = require('express');                                               //MVC framework
const expressLayouts = require('express-ejs-layouts');
const logger = require('morgan');                                                 //Logging
const path = require('path');                                                     //directory traversal
const cors = require('cors');
const helmet = require('helmet');  // gotta configure this
const passport = require('passport');                                             //authentication middleware
const session = require('express-session');                                       //login session middleware
const sessionStorage = require('express-session-sequelize')(session.Store);       //login session middleware
const cookieParser = require('cookie-parser');                                    //Session cookie parser
const flash = require('express-flash');                                           //pop up messages
const homeRoutes = require('./routes/home');                                      //Home routes
const torrentRoutes = require('./routes/torrents.js')                             //Torrent client routes
const { sequelize, connectDB }= require('./config/database');                     //Sqlite database

// Express init
const app = express();

// .env config
require('dotenv').config({ path: 'config/.env' });

// Passport init
require('./config/passport')(passport);

// Database init
connectDB();

// Client side middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/loggedIn');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

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


const PORT = process.env.PORT || 5000;

// Basic logging in dev mode
if (process.env.NODE_ENV === 'development') {
  logger('dev');
}

// App start
app.listen(PORT, () => console.log(`Toucan flying in ${process.env.NODE_ENV} mode on port ${PORT}!`));