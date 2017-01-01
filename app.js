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
mongoose.connect(localdb);
require("./models/models.js");

var index = require('./routes/index')
var api = require('./routes/api');  

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
	secret: '1Dut5a43815f65d9fe50bea6b4a1102ee755d14cd7c9e3525c3bcca7731850ed1245SCz1Bh2PF1g8WMLkDMhMva4GHEYFgsszG6cjWxJmdzFU1DGBvGDyVkRS9ahXjutEvTyK6DuhH58gSWn8vwofeN4W6guXBGFH7f'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//// Initialize Passport
var initPassport = require('./passport-init.js');
initPassport(passport);



app.use('/api', api);
// app.use('/auth', authenticate);

// app.get("/*", function(req, res, next) {
//     res.sendfile(__dirname + '/public/views/index.html');
// });

// app.get('*', function (req, res) {
//     res.sendFile(__dirname + '/public/views/index.html');
// });



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
