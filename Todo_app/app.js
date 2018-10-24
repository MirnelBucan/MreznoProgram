const express = require('express'),
 path = require('path'),
 favicon = require('serve-favicon'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser'),
 session = require('express-session'),
 expressValidator = require('express-validator'),
 auth = require('./util/auth');
console.log(typeof(auth));
const routes = require('./routes/index');
const users = require('./routes/users');
const todo = require('./routes/todo');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Handle Sessions
app.use(session({
  secret: 'Pravo?opasna#tajna', //use .env to store or in onther module
  saveUninitialized: false,
  resave: false
}));
// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth());
app.use('/', routes);
app.use('/users', users);
app.use('/todo',todo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

// production error handler
// no stacktraces leaked to user

module.exports = app;