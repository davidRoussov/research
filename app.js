var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var authenticate = require('./routes/authenticate')(passport);

var mongoose = require('mongoose');
var localdb = 'mongodb://localhost/test-research';

// heroku cli: heroku config
var dbconnect = "mongodb://heroku_hw092bz0:dvfkjsqqfqpfa8sghhneeugoil@ds159988.mlab.com:59988/heroku_hw092bz0";
mongoose.connect(dbconnect);
require("./models/models.js");

var index = require('./routes/index')
var api = require('./routes/api');  

var favicon = require('serve-favicon');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({secret: 'orgnwore7y876976g975f976f7o6fignewrogin'}));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);



app.use('/api', api);
app.use('/auth', authenticate);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
